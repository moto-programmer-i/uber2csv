class BrowserUtils {
    static get BLOB_TYPE_CSV() {
        return "text/csv";
    }
    static toBlob(content, type) {
        return new Blob([content], {type: type});
    }

    /**
     * ダウンロード
     * @param {Blob} blob 内容
     * @param {string} filename ファイル名
     */
    static download(blob, filename) {
        const a = document.createElement("a");
        a.download = filename;
        a.target = "_blank";
        // a.hidden = true;
        const objectURL = URL.createObjectURL(blob);
        try {
            a.href = objectURL;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } finally {
            URL.revokeObjectURL(objectURL);
        }
    }

    /**
     * ファイル読み込み時に使えるPromiseを作成
     * @param {FileReader} fileReader
     * @returns Promise （<>の型はFileReader.result）
     */
    static generatePromiseWithFileReader(fileReader) {
        // FileReaderがPromiseを使っていないので使う
        // 参考 https://qiita.com/dojyorin/items/26f1a48085e0bbcf40b7

        return new Promise((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (target) => {
                console.error("ファイルの読み込みに失敗しました。\n\n" + reader.error);
                reader.abort();
                reject(reader.error);
            }
        });
    }
}