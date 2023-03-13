/**
 * Uberの一週間ごとの明細
 */
class UberPaymentData {
    /**
     * @type {SimpleDate}
     */
    #startDate;
    /**
     * 日付（週の始まりの日）
     * @type {SimpleDate}
     */
    get startDate() {
        return this.#startDate;
    }
    /**
     * 日付を設定
     * @type {SimpleDate}
     */
    set startDate(value) {
        this.#startDate = value;
    }

    /**
     * @type {SimpleDate}
     */
    #endDate;
    /**
     * 日付（週の終わりの日）
     * @type {SimpleDate}
     */
    get endDate() {
        return this.#endDate;
    }
    /**
     * 日付を設定
     * @type {SimpleDate}
     */
    set endDate(value) {
        this.#endDate = value;
    }

    
    #sale = 0;
    /**
     * 売り上げ
     */
    get sale() {
        return this.#sale;
    }
    /**
     * 売り上げを設定
     * @param value 不正な値は0とみなす
     */
    set sale(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#sale = value;
    }
    

    
    #fee = 0;
    /**
     * 支払手数料
     */
    get fee() {
        return this.#fee;
    }
    /**
     * 支払い手数料を設定
     * @param value 不正な値は0とみなす
     */
    set fee(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#fee = value;
    }


    /**
     * @type {SimpleDate}
     */    
    #depositDate;
    /**
     * 振込日
     * @type {SimpleDate}
     */
    get depositDate() {
        return this.#depositDate;
    }
    /**
     * 振込日を設定
     * @type {SimpleDate}
     */
    set depositDate(value) {
        this.#depositDate = value;
    }


    #deposit = 0;
    /**
     * 銀行口座に振り込まれた金額
     */
    get deposit() {
        return this.#deposit;
    }
    /**
     * 銀行口座に振り込まれた金額を設定
     * @param value 不正な値は0とみなす
     */
    set deposit(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#deposit = value;
    }

    
    #cash = 0;
    /**
     * 受け取った現金
     */
    get cash() {
        return this.#cash;
    }
    /**
     * 受け取った現金を設定
     * @param value 不正な値は0とみなす
     */
    set cash(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#cash = value;
    }

    
    #repayment = 0;
    /**
     * 返金と経費（Uberへクレジットカードで送金した金額）
     */
    get repayment() {
        return this.#repayment;
    }
    /**
     * 返金と経費（Uberへクレジットカードで送金した金額）を設定
     * @param value 不正な値は0とみなす
     */
    set repayment(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#repayment = value;
    }


    #previousSale = 0;
    /**
     * 過去の週のイベント（前の週のチップなど、つまり売上）
     */
    get previousSale() {
        return this.#previousSale;
    }
    /**
     * 売り上げを設定
     * @param value 不正な値は0とみなす
     */
    set previousSale(value) {
        if (!Number.isFinite(value)) {
            value = 0;
        }
        this.#previousSale = value;
    }

    constructor() {
    }

    /**
     * 数値が全て0か
     * （日付は無視）
     * @returns true: 数値が全て0、false: それ以外
     */
    isZero() {
        return this.#sale == 0
            && this.#cash == 0
            && this.deposit == 0
            && this.#fee == 0
            && this.#repayment == 0
            && this.#previousSale == 0;
    }
}