class UberPaymentCsvConfig {
    /**
     * 科目コード
     * @type {Map<Number, string>}
     */
    #codeMap = new Map();


    #uberCode = 1168;
    /**
     * 勘定科目コード Uber
     */
    get uberCode() {
        return this.#uberCode;
    }
    set uberCode(value) {
        this.#uberCode = value;
        this.#codeMap.set(value, "Uber");
    }

    #uberFeeCode = 1;
    /**
     * 補助科目コード Uber手数料
     */
    get uberFeeCode() {
        return this.#uberFeeCode;
    }
    set uberFeeCode(value) {
        this.#uberFeeCode = value;
        // 補助科目は今の所codeMapに登録する必要なし
    }



    
    #saleCode = 8000;
    /**
     * 勘定科目コード 売上高
     */
    get saleCode() {
        return this.#saleCode;
    }
    set saleCode(value) {
        this.#saleCode = value;
        this.#codeMap.set(value, "売上高");
    }


    #feeCode = 8581;
    /**
     * 勘定科目コード 支払手数料
     */
    get feeCode() {
        return this.#feeCode;
    }
    set feeCode(value) {
        this.#feeCode = value;
        this.#codeMap.set(value, "支払手数料");
    }


    #ownerLoanCode = 3180;
    /**
     * 勘定科目コード 事業主貸
     */
    get ownerLoanCode() {
        return this.#ownerLoanCode;
    }
    set ownerLoanCode(value) {
        this.#ownerLoanCode = value;
        this.#codeMap.set(value, "事業主貸");
    }

    #ownerDebtCode = 7320;
    /**
     * 勘定科目コード 事業主借
     */
    get ownerDebtCode() {
        return this.#ownerDebtCode;
    }
    set ownerDebtCode(value) {
        this.#ownerDebtCode = value;
        this.#codeMap.set(value, "事業主借");
    }

    

    constructor() {
    }

    /**
     * コード変換
     * @param {number} code 
     * @returns 対応するコードがない場合は空文字
     */
    convertCode(code) {
        return ObjectUtils.getDefaultByMap(this.#codeMap, code, "");
    }
   
}