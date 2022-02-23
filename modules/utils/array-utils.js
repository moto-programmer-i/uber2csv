

/**
 * 配列汎用メソッド集
 */
class ArrayUtils {
    /**
     * 分割する量を返す
     * 
     * @returns 配列を分割する要素数
     */
    // JavaScriptでのクラス定数
    static get SLICE_QUANTUM() {
        return 32768;
    }
    /**
     * 配列が空か判定
     * @param {Array} arr 
     * @returns false: 長さ1以上の配列の場合、true：それ以外
     */
    static isEmpty(arr) {
        if (!Array.isArray(arr)) {
            return true;
        }
        return arr.length <= 0;
    }

    /**
     * 配列に配列を追加
     * @param {Array} originalArray
     * @param {Array} newArray
     */
    static pushArray(originalArray, newArray) {
        if (!Array.isArray(originalArray) || this.isEmpty(newArray)) {
            return;
        }

        // 配列を追加する場合、要素数が大きいと不具合が出る場合があるそうなので対処用
        // （引数の数が万単位になってくると問題が発生する場合があるらしい）
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push#merging_two_arrays
        if (newArray.length < this.SLICE_QUANTUM) {
            originalArray.push(...newArray);
            return;
        }

        // 分割して少しずつ追加
        for (let i = 0, endIndex; i < newArray.length; i = endIndex) {
            endIndex = i + this.SLICE_QUANTUM;
            originalArray.push(...newArray.slice(i, endIndex));
        }
    }

    /**
     * 一致する要素を削除
     * @param {Array<T>} arr 
     * @param {T} target 対象
     * @returns 
     */
    static delete(arr, target) {
        if (this.isEmpty(arr)) {
            return;
        }

        for (let i = 0; i < arr.length; ++i) {
            if (arr[i] === target) {
                arr.splice(i, 1);
                --i;
            }
        }
    }
}