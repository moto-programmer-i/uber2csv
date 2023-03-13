/**
 * ただの年、月、日のデータ
 */
class SimpleDate {
    /**
     * 年
     * @type {number}
     */
    #year;
    /**
     * 年を取得
     * @type {number}
     */
    get year() {
        return this.#year;
    }
    /**
     * 年を設定
     * @param value 数値に変換される
     */
    set year(value) {
        this.#year = Number.parseInt(value);
    }

    
    /**
     * 月
     * @type {number}
     */
    #month;
    /**
     * 月を取得
     * @type {number}
     */
    get month() {
        return this.#month;
    }
    /**
     * 月を設定
     * @param value 数値に変換される
     */
    set month(value) {
        this.#month = Number.parseInt(value);
    }


    /**
     * 日
     * @type {number}
     */
    #day;
    /**
     * 日を取得
     * @type {number}
     */
    get day() {
        return this.#day;
    }
    /**
     * 日を設定
     * @param value 数値に変換される
     */
    set day(value) {
        this.#day = Number.parseInt(value);
    }


    /**
     * 区切られた日付の、年のインデックス
     */
      static get YEAR_INDEX() {
        return 0;
    }

    /**
     * 区切られた日付の、月のインデックス
     */
    static get MONTH_INDEX() {
        return 1;
    }

    /**
     * 区切られた日付の、日のインデックス
     */
    static get DAY_INDEX() {
        return 2;
    }

    /**
     * 文字列からインスタンスを作成
     * @param {string} dateStr 日付の文字列（例：2021/05/03）
     * @param {string} separator 区切り文字（例：/ ）
     */
    static ofString(dateStr, separator) {
        const strs = dateStr.split(separator);
        return new SimpleDate(strs[this.YEAR_INDEX], strs[this.MONTH_INDEX], strs[this.DAY_INDEX]);
    }

    /**
     * 文字列からインスタンスを作成
     * @param {string} dateStr 日付の文字列（例：2021/05/03）
     * @param {RegExp} pattern 文字パターン（例：/(\\d+)/g ）
     */
    static ofStringRegExp(dateStr, pattern) {
        const strs = pattern.match(dateStr);
        return new SimpleDate(strs[this.YEAR_INDEX], strs[this.MONTH_INDEX], strs[this.DAY_INDEX]);
    }

    /**
     * インスタンス作成
     * @param year 年（数値に変換される）
     * @param month 月（数値に変換される）
     * @param day 日（数値に変換される）
     */
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}