// require PDF.js
// https://github.com/mozilla/pdf.js

// モジュール化がエラーで動作せず断念（ローカルファイルのときのみ発生するという可能性もある）
// Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
// import { UberPaymentData } from './modules/uber-payment-data.js';




async function main() {
    // 処理中画面を出す
    const loading = document.getElementById("loading");
    loading.style.visibility = "visible";
    try {
        // Uber売り上げPDF取得
        const uberDocuments = document.getElementById("uberDocuments").files;
        if (!uberDocuments || uberDocuments.length <= 0) {
            return;
        }

        // データに変換
        const uberPaymentDatas = await uberDocumentsToDatas(uberDocuments);

        // データがない場合は終了
        if (ArrayUtils.isEmpty(uberPaymentDatas)) {
            alert("PDFを変換した結果、有効なデータがありませんでした。");
            return;
        }

        // CSVコード設定読み込み
        const config = new UberPaymentCsvConfig;
        config.uberCode = Number.parseInt(document.getElementById("uberCode").value);
        config.uberFeeCode = Number.parseInt(document.getElementById("uberFeeCode").value);
        config.saleCode = Number.parseInt(document.getElementById("saleCode").value);
        config.feeCode = Number.parseInt(document.getElementById("feeCode").value);
        config.ownerLoanCode = Number.parseInt(document.getElementById("ownerLoanCode").value);
        config.ownerDebtCode = Number.parseInt(document.getElementById("ownerDebtCode").value);

        // CSV変換
        const csvConverter = new FreewayCsvConverter();
        const csv = csvConverter.convertToCsv(config, uberPaymentDatas);

        // sjisにエンコード
        // https://github.com/polygonplanet/encoding.js
        // https://tips.recatnap.info/laboratory/detail/js_convert_charcode_before_download_file
        const sjisArray = Encoding.convert(Encoding.stringToCode(csv), "SJIS");
        BrowserUtils.download(BrowserUtils.toBlob(new Uint8Array(sjisArray), "text/csv"), FreewayCsvConstants.FILE_NAME_FOR_FREE_VERSION, BrowserUtils.BLOB_TYPE_CSV);
    }
    catch (error) {
        alert(error);
        console.error(error);
    }
    finally {
        // 処理中画面を消す
        loading.style.visibility = "hidden";
    }
    
}