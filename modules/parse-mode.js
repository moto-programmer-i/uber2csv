/**
 * 解析モード
 */
class ParseMode {
    /**
     * 解析用の正規表現
     * @type RegExp
     */
    #pattern;
    get pattern() {
        return this.#pattern;
    }

    /**
     * 解析後に実行する関数
     * @type {(RegExpExecArray, index: Number, source) => void}
     */
    #action;

    /**
     * 優先フラグ
     */
    #primalFlag = false;
    get primalFlag() {
        return this.#primalFlag;
    }
    
    /**
     * 元に戻す条件
     * @type RegExp
     */
     #revertPattern;
     get revertPattern() {
         return this.#revertPattern;
     }
    
    /**
     * 解析モードを生成
     * @param {RegExp} pattern 解析パターン
     * @param {(result: RegExpExecArray, index: Number, source) => void} action 解析がヒットした後の関数
     * @param {boolean} primalFlag 優先フラグ
     * @param {RegExp} revertPattern 元に戻すパターン
     */
    constructor(pattern, action, primalFlag = false, revertPattern = null) {
        this.#pattern = pattern;
        this.#action = action;
        this.#primalFlag = primalFlag;
        this.#revertPattern = revertPattern;
    }

    /**
     * 正規表現による検索を行い、ヒットすれば関数実行
     * 
     * 参考 https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
     * @param {string} str 
     * @param {number} index
     * @param source 解析元ソース
     * @returns RegExp.execの結果
     */
    actionIfExecutable(str, index, source) {
        const result = this.#pattern.exec(str);

        // ヒットしなければfalseで終了
        if (result == null) {
            return false;
        }

        // ヒットすればactionを実行
        this.#action(result, index, source);
        return true;
    }
}