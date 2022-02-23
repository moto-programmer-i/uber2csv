/**
 * 整数解析モード
 */
class IntegerParseMode extends ParseMode {
    /**
     * 解析後に実行する関数
     * @type (number) => void;
     */
    #withInteger;
    
    /**
     * 解析モードを生成
     * @param {(number: Number) => void} withInteger 整数を使った関数
     * @param {RegExp} 元に戻す条件
     */
    constructor(withInteger, primalFlag = false, revertPattern) {
        // 整数解析パターン、解析結果を整数にしてwithIntegerを呼び出すようにする
        super(
            UberDocumentConstants.UBER_INTEGER_PATTERN,
            (result) => {
                this.#withInteger(NumberUtils.parseIntWithCommas(result[UberDocumentConstants.REGEXP_EXEC_RESULT_INDEX]));
            },
            primalFlag,
            revertPattern
        )

        this.#withInteger = withInteger;
    }
}