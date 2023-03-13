
/**
 * 
 * @param {FileList} uberDocuments Uber売り上げPDF配列
 * @returns {Array<UberPaymentData>} Uber売り上げデータ配列
 */
async function uberDocumentsToDatas(uberDocuments) {
    const uberPaymentDatas = new Array();

    // メモリ使用量を考慮し、同期しながらPDFを1つずつ変換する
    for(let uberDocument of uberDocuments) {
        const uberPaymentData = await uberDocumentToData(uberDocument);

         // 日付以外の売り上げなどの情報が存在すれば追加
        if (!uberPaymentData.isZero()) {
            uberPaymentDatas.push(uberPaymentData);
        }
    }

    return uberPaymentDatas;
}


/**
 * Uber売上PDFの変換
 * 
 * @param {File} uberDocument Uber売り上げのPDFファイル
 * @returns Uber売り上げデータ
 */
 async function uberDocumentToData(uberDocument) {
    // PDFファイル読み込み
    // （fileReader.onloadがPromiseじゃないので、Promiseにする）
    const fileReader = new FileReader();
    const fileReadPromise = BrowserUtils.generatePromiseWithFileReader(fileReader);
    fileReader.readAsArrayBuffer(uberDocument);
    const arrayBuffer = await fileReadPromise;

    // PDFからArray<TextItem | TextMarkedContent>を取得
    // 参考
    // https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L689
    // https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L1082
    // https://stackoverflow.com/a/62173416
    const pdfDocumentProxy = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

    // 対象のページを、Array<TextItem | TextMarkedContent>に変換
    const textItems = new Array();
    for (let i = UberDocumentConstants.UBER_SALE_FIRST_PAGE_INDEX; i <= pdfDocumentProxy.numPages && i <= UberDocumentConstants.UBER_SALE_PAGE_NUM; ++i) {
        const page = await pdfDocumentProxy.getPage(i);

        // TextContent https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L1081
        const textContent = await page.getTextContent();
        ArrayUtils.pushArray(textItems, textContent.items);
    }    
    
    // さらにUberPaymentDataに変換
    return textItemsToData(textItems);
}


/**
 * PDFのテキスト情報からデータ用のクラスに変換
 * @param {Array<TextItem | TextMarkedContent>} textItems 
 * @returns Uber売り上げデータ
 */
function textItemsToData(textItems) {
    const uberPaymentData = new UberPaymentData();

    // 前回の解析モード（キャンセルのときに元に戻すため）
    let previousParseMode;

    // 利用する解析モード
    const parseModes = [

        // 週の始まりの年を探して保存（他の4桁の数字が先に来る場合は修正が必要）
        new ParseMode(UberDocumentConstants.UBER_START_YEAR_PATTERN, (result, index, source) => {
            uberPaymentData.startDate = new SimpleDate();
            uberPaymentData.startDate.year = result[UberDocumentConstants.REGEXP_EXEC_PART_INDEX];

            // 月を保存
            parseModes.unshift(new IntegerParseMode(
                month => {
                    uberPaymentData.startDate.month = month;

                    // 日を保存
                    parseModes.unshift(new IntegerParseMode(day => uberPaymentData.startDate.day = day, true));
                },
                true
            ));
        }),


        // 週の終わりの年を探して保存（他の4桁の数字が先に来る場合は修正が必要）
        new ParseMode(UberDocumentConstants.UBER_END_YEAR_PATTERN, (result, index, source) => {
            uberPaymentData.endDate = new SimpleDate();
            uberPaymentData.endDate.year = result[UberDocumentConstants.REGEXP_EXEC_PART_INDEX];

            // 月を保存
            parseModes.unshift(new IntegerParseMode(
                month => {
                    uberPaymentData.endDate.month = month;

                    // 日を保存
                    parseModes.unshift(new IntegerParseMode(day => uberPaymentData.endDate.day = day, true));
                },
                true
            ));
        }),
        
        // 日付が "2022/5/3" ではなく、"2022", "5", "3" と分かれてくるようになってしまったため廃止
        // // 週の始まりの日付を探して保存
        // new ParseMode(UberDocumentConstants.UBER_START_DATE_PATTERN, (result, index, source) => {
        //     uberPaymentData.startDate = SimpleDate.ofStringRegExp(result[UberDocumentConstants.REGEXP_EXEC_PART_INDEX], UberDocumentConstants.UBER_DATE_PATTERN);
        // }),

        // // 週の終わりの日付を探して保存
        // new ParseMode(UberDocumentConstants.UBER_END_DATE_PATTERN, (result, index, source) => {
        //     uberPaymentData.endDate = SimpleDate.ofStringRegExp(result[UberDocumentConstants.REGEXP_EXEC_PART_INDEX], UberDocumentConstants.UBER_DATE_PATTERN);
        // }),


        // 売り上げのラベルを探し、次の数値を売り上げとみなす
        new ParseMode(UberDocumentConstants.UBER_SALE_LABEL_PATTERN, (result, index, source) => {
            parseModes.unshift(new IntegerParseMode(
                num => uberPaymentData.sale = num,
                true,
                // 売り上げだけは、「売り上げの明細」が先に読み込まれてしまう場合があるため元に戻す
                UberDocumentConstants.UBER_SALE_REVERT_PATTERN
            ));
        }),

        // サービス料（支払手数料）のラベルを探し、次の数値を支払手数料とみなす
        new ParseMode(UberDocumentConstants.UBER_FEE_LABEL_PATTERN, (result, index, source) => {
            parseModes.unshift(new IntegerParseMode(num => uberPaymentData.fee = num, true));
        }),

        // 銀行口座への振り込みのラベルを探す
        new ParseMode(UberDocumentConstants.UBER_DEPOSIT_LABEL_PATTERN, (result, index, source) => {
            // 振込年は週の始まりの日付（例：2021/05/03）から取得
            uberPaymentData.depositDate = new SimpleDate();
            if (uberPaymentData.startDate) {
                uberPaymentData.depositDate.year = uberPaymentData.startDate.year;
            }
            // ない場合はないはずだが、もしそういう状況が発生した場合は、一応前年を設定
            else {
                uberPaymentData.depositDate.year = UberDocumentConstants.TODAY.getFullYear();
            }

            // ラベルより前に振込日付が書いてあるため、前を探して設定
            // 例：5月3日(月) 4:01 に銀行口座に振り込まれました
            // 汚いが、他の手段が思いつかない

            // ( の位置まで戻る
            do {
                --index;
            } while(source[index].str != "(");

            // 次の数値が日
            let regExpExecArray;
            do {
                --index;
                regExpExecArray = UberDocumentConstants.UBER_INTEGER_PATTERN.exec(source[index].str);
            } while(regExpExecArray == null);
            uberPaymentData.depositDate.day = regExpExecArray[UberDocumentConstants.REGEXP_EXEC_RESULT_INDEX];

            // 次の数値が月
            do {
                --index;
                regExpExecArray = UberDocumentConstants.UBER_INTEGER_PATTERN.exec(source[index].str);
            } while(regExpExecArray == null);
            uberPaymentData.depositDate.month = regExpExecArray[UberDocumentConstants.REGEXP_EXEC_RESULT_INDEX];

            // 次の数値を振り込まれた金額とみなす
            parseModes.unshift(new IntegerParseMode(num => uberPaymentData.deposit = num, true));
        }),

        // 受け取った現金のラベルを探し、次の数値を振り込まれた金額とみなす
        new ParseMode(UberDocumentConstants.UBER_CASH_LABEL_PATTERN, (result, index, source) => {
            parseModes.unshift(new IntegerParseMode(num => uberPaymentData.cash = num, true));
        }),

        // 返金と経費のラベルを探し、次の数値を振り込まれた金額とみなす
        new ParseMode(UberDocumentConstants.UBER_REPAYMENT_LABEL_PATTERN, (result, index, source) => {
            parseModes.unshift(primalParseMode = new IntegerParseMode(num => uberPaymentData.repayment = num, true));
        }),
    ];


    // テキストを1つずつ解析
    for(let i = 0; i < textItems.length; ++i) {
        const textItem = textItems[i];
        if (!textItem || !textItem.str) {
            continue;
        }

        // 他の解析モード実行、終了したらそのモードを消す
        for (const parseMode of parseModes) {
            if (parseMode.actionIfExecutable(textItem.str, i, textItems)) {
                ArrayUtils.delete(parseModes, parseMode);
                previousParseMode = parseMode;

                // 取得する情報がなくなったら返す
                if (parseModes.length <= 0 && !primalParseMode) {
                    return uberPaymentData;
                }
                break;
            }

            // 元に戻す条件に一致した場合は元に戻す
            if (parseMode.revertPattern && parseMode.revertPattern.test(textItem.str) && previousParseMode) {
                ArrayUtils.delete(parseModes, parseMode);
                parseModes.unshift(previousParseMode);
                previousParseMode = null;
                break;
            }
            
            // 優先解析モードの場合は次のテキストへ
            if (parseMode.primalFlag) {
                break;
            }
        }
    }

    return uberPaymentData;

}



