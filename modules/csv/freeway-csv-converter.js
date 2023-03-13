
/**
 * フリーウェイ経理用CSV変換
 */
class FreewayCsvConverter {
    /**
     * フリーウェイ用の日付表記に変換
     * 
     * 以下、引用
     * 年月日・6 桁    平成 23 年 12 月 10 日の場合→「231210」
     * 令和 1 年 5 月 1 日の場合→「310501」
     * ※令和の場合、年数部分は「30+令和の年数」としてください。
     * @param {SimpleDate} simpleDate 日付
     * @return 例："231210"
     */
    static convertDateString(simpleDate) {
        // 年を西暦からフリーウェイ用の和暦に変換し、0埋め
        const yearStr = NumberUtils.padZero(simpleDate.year - FreewayCsvConstants.FREEWAY_YEAR_SUBTRACT, FreewayCsvConstants.YEAR_LENGTH);

        // 月、日を0埋め
        const monthStr = NumberUtils.padZero(simpleDate.month, FreewayCsvConstants.MONTH_LENGTH);
        const dayStr = NumberUtils.padZero(simpleDate.day, FreewayCsvConstants.DAY_LENGTH);

        // 年月日としてつなげる
        return yearStr + monthStr + dayStr;
    }
    
    /**
     * CSV変換用の設定
     * @type {UberPaymentCsvConfig}
     */
    #config;

    constructor() {
    }

    /**
     * Uberの売上データをCSVに変換
     * 
     * @param {FreewayCsvConfig} config CSV変換用の設定
     * @param {Array<UberPaymentData>} uberPaymentDatas Uberの売上データ
     * @returns {string} 変換したCSV
     */
    convertToCsv(config, uberPaymentDatas) {
        this.#config = config;

        // データがなければ空文字を返す
        if (ArrayUtils.isEmpty(uberPaymentDatas)) {
            return "";
        }

        // データをまずJSONに変換
        const jsonArray = new Array();
        for (const uberPaymentData of uberPaymentDatas) {
            this.convertData(uberPaymentData, jsonArray);
        }
        
        // CSVに変換
        return Papa.unparse(jsonArray);
    }

    /**
     * 
     * @param {UberPaymentData} uberPaymentData Uber売上データ
     * @param {Array} jsonArray 結果格納用 JSON配列
     * @returns 
     */
    convertData(uberPaymentData, jsonArray) {
        // 日付をフリーウェイ経理用に変換
        const freewayDateString = FreewayCsvConverter.convertDateString(uberPaymentData.endDate);
        
        // 売上の数値から、
        // 借方 Uber    貸方 売上
        if (uberPaymentData.sale > 0) {
            jsonArray.push(
                this.generateJson({
                    freewayDateString,
                    debitCode: this.#config.uberCode,
                    creditCode: this.#config.saleCode,
                    money: uberPaymentData.sale,
                    memo: FreewayCsvConstants.SALE_MEMO
                })
            );
        }

        // サービス料（支払手数料）から、
        // 借方 支払手数料 Uber手数料     貸方 売上
        if (uberPaymentData.fee > 0) {
            jsonArray.push(
                this.generateJson({
                    freewayDateString,
                    debitCode: this.#config.feeCode,
                    subDebitCode: this.#config.uberFeeCode,
                    creditCode: this.#config.saleCode,
                    money: uberPaymentData.fee,
                    memo: FreewayCsvConstants.FEE_MEMO
                })
            );
        }

        // 振込から、
        // 借方 事業主貸     貸方 Uber
        if (uberPaymentData.deposit > 0) {
            // 振込日をフリーウェイ経理用に変換
            // （配達員の口座に振り込まれた日付と異なり、修正が必要なので ? をつける）
            const depositDateString = FreewayCsvConverter.convertDateString(uberPaymentData.depositDate) + "?";

            jsonArray.push(
                this.generateJson({
                    freewayDateString: depositDateString,
                    debitCode: this.#config.ownerLoanCode,
                    creditCode: this.#config.uberCode,
                    money: uberPaymentData.deposit,
                    memo: FreewayCsvConstants.DEPOSIT_MEMO
                })
            );
        }

        // 受け取った現金から、
        // 借方 事業主貸     貸方 Uber
        if (uberPaymentData.cash > 0) {
            jsonArray.push(
                this.generateJson({
                    freewayDateString,
                    debitCode: this.#config.ownerLoanCode,
                    creditCode: this.#config.uberCode,
                    money: uberPaymentData.cash,
                    memo: FreewayCsvConstants.CASH_MEMO
                })
            );
        }

        // 返金と経費から、
        // 借方 Uber     貸方 事業主借
        if (uberPaymentData.repayment > 0) {
            jsonArray.push(
                this.generateJson({
                    freewayDateString,
                    debitCode: this.#config.uberCode,
                    creditCode: this.#config.ownerDebtCode,
                    money: uberPaymentData.repayment,
                    memo: FreewayCsvConstants.REPAYMENT_MEMO
                })
            );
        }

        // 過去のイベントの数値から、
        // 借方 Uber    貸方 売上
        if (uberPaymentData.previousSale > 0) {
            jsonArray.push(
                this.generateJson({
                    freewayDateString,
                    debitCode: this.#config.uberCode,
                    creditCode: this.#config.saleCode,
                    money: uberPaymentData.previousSale,
                    memo: FreewayCsvConstants.PREVIOUS_SALE_MEMO
                })
            );
        }
    }

    /**
     * JSON作成
     * @param content JSONの内容
     * @param {string} content.freewayDateString 日付 令和 1 年 5 月 1 日の場合→「310501」
     * @param {number} content.debitCode 借方科目コード
     * @param {number} content.subDebitCode 借方補助コード
     * @param {number} content.creditCode 貸方科目コード
     * @param {number} content.subCreditCode 貸方補助コード
     * @param {number} content.money 金額
     * @param {string} content.memo 摘要（メモ）
     * @returns 
     */
    generateJson(content = {
            freewayDateString: "",
            debitCode: 0,
            subDebitCode: 0,
            creditCode: 0,
            subCreditCode: 0,
            money: 0,
            memo: ""
        }
        ) {
        /*
        仕訳データ
        ※1 行目からデータを入力します。（タイトル行は不要です）

        列名    項目名           文字数・桁数              内容
        A       伝票番号         ※入力必須 4 桁           使用していなくても、必ず「0（ゼロ）」を入力します。
        B       部門コード       2 桁                     部門マスタで登録したコードを入力します。
        C       工事番号         6 桁
        D       日付            ※入力必須 年月日・6 桁    平成 23 年 12 月 10 日の場合→「231210」
                                                        令和 1 年 5 月 1 日の場合→「310501」
                                                        ※令和の場合、年数部分は「30+令和の年数」としてください。
        E       借方科目コード   ※入力必須 4 桁           科目マスタで登録したコードと科目名を入力します。
        F       借方科目名       全角 4 文字
                                （半角 8 文字）
        G       借方補助コード    4 桁                    補助マスタで登録したコードを入力します。
        H       貸方科目コード    ※入力必須 4 桁          科目マスタで登録したコードと科目名を入力します。
        I       貸方科目名        全角 4 文字
                                （半角 8 文字）
        J       貸方補助コード    4 桁                    補助マスタで登録したコードを入力します。
        K       金額             11 桁                   「,（カンマ）」を含めずに入力します。
        L       摘要             全角 32 文字            （半角 64 文字） 「,（カンマ）」を含めずに入力します。
        M       課税区分          2 桁                     課税区分マスタの区分を入力します。
        N       税率区分          2 桁                     税率区分マスタの区分を入力します。
        O       資金繰り科目コード 4 桁                     科目マスタで登録したコードを入力します。
        P       手形期日         ※入力必須 年月日・6 桁     平成 23 年 12 月 10 日の場合→「231210」
                                                        使用していなくても、必ず「0（ゼロ）」を入力します。

        https://faq.freeway-japan.com/faq/show/365?site_domain=default
        https://faq.freeway-japan.com/usr/file/attachment/58V5XZ2LMhPJlfuc.pdf?attachment_log=1&object_id=365&object_type=faq&site_domain=default
        */
        // 使う必要のない値は固定値
        return {
            "伝票番号": 0,
            "部門コード": 0,
            "工事番号": 0,
            "日付": content.freewayDateString,
            "借方科目コード": content.debitCode,
            "借方科目名": this.#config.convertCode(content.debitCode),
            "借方補助コード": content.subDebitCode,
            "貸方科目コード": content.creditCode,
            "貸方科目名": this.#config.convertCode(content.creditCode),
            "貸方補助コード": content.subCreditCode,
            "金額": content.money,
            "摘要": content.memo,
            "課税区分": 0,
            "税率区分": 0,
            "資金繰り科目コード": 0,
            "手形期日": 0
        };
    }

    
}

