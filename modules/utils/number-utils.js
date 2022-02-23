class NumberUtils {
    /**
     * カンマ付き数字を数値に変換
     * @param {string} strWithCommas カンマ付き数字（1,234,567など）
     * @returns 引数がnullの場合はnull
     */
     static parseIntWithCommas(strWithCommas) {
        if (strWithCommas == null) {
            return null;
        }
        return Number.parseInt(strWithCommas.replaceAll(/,/g, ''));
    }

    /**
     * 数値を0埋めした文字列に変換
     * （例：padZero(1, 2) => "01"）
     * @param {number} num 数値
     * @param {number} maxLength 長さ
     * @returns 
     */
    static padZero(num, maxLength) {
        return num.toString().padStart(maxLength, "0");
    }
}