/**
 * その他汎用メソッド集
 */
class ObjectUtils {
    /**
     * nullの場合デフォルト値を返す
     * @template T 任意の型
     * @param {T} nullable nullになる可能性のある値
     * @param {T} defaultValue デフォルト値
     * @returns {T} nullable（nullの場合はデフォルト値）
     */
    static getDefault(nullable, defaultValue) {
        return nullable != null ? nullable: defaultValue;
    }

    /**
     * nullの場合デフォルト値を返す
     * @template K Mapのキー
     * @template V Mapの値
     * @param {Map<K, V>} map マップ
     * @param {K} key キー値
     * @param {V} defaultValue デフォルト値
     * @returns {V} map.get(key)（nullの場合はデフォルト値）
     */
    static getDefaultByMap(map, key, defaultValue) {
        return this.getDefault(map.get(key), defaultValue);
    }

}