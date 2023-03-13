/**
 * フリーウェイ経理用の定数
 */
class FreewayCsvConstants {
    /**
     * フリーウェイ経理の年の桁数
     */
     static get YEAR_LENGTH() {
        return 2;
    }

    /**
     * フリーウェイ経理の月の桁数
     */
     static get MONTH_LENGTH() {
        return 2;
    }

    /**
     * フリーウェイ経理の日の桁数
     */
     static get DAY_LENGTH() {
        return 2;
    }

    /**
     * 平成元年を1にするため、西暦から引く数字
     */
    static get FREEWAY_YEAR_SUBTRACT() {
        // フリーウェイ経理は残念ながら平成元年を1として処理している。西暦から1988を引くと計算が合う
        return 1988;
    }

    /**
     * 借方 Uber        貸方 売上
     * の摘要（配送報酬）
     */
    static get SALE_MEMO() {
        return "Uber配送報酬";
    }
    /**
     * 借方 支払手数料    貸方 売上
     * の摘要（Uber手数料）
     */
    static get FEE_MEMO() {
        return "Uber手数料";
    }
    /**
     * 借方 事業主貸      貸方 Uber
     * の摘要（Uberからの入金（銀行口座））
     */
    static get DEPOSIT_MEMO() {
        return "Uberからの入金（銀行口座）";
    }
    /**
     * 借方 事業主貸      貸方 Uber
     * の摘要（現金の受け取り（現金対応））
     */
    static get CASH_MEMO() {
        return "現金の受け取り（現金対応）";
    }
    /**
     * 借方 Uber    貸方 事業主貸
     * の摘要（Uberへの送金（クレジットカード））
     */
    static get REPAYMENT_MEMO() {
        return "Uberへの送金（クレジットカード）";
    }

    /**
     * 借方 Uber        貸方 売上
     * の摘要（過去の週の売上）
     */
    static get PREVIOUS_SALE_MEMO() {
        return "Uber配送報酬 過去の週";
    }

    /**
     * 無料版のファイル名
     */
    static get FILE_NAME_FOR_FREE_VERSION() {
        return "KAI0000-Shiwake.CSV";
    }
}