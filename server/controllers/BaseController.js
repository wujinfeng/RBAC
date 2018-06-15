/**
 * 控制器的基类
 * Created by fu_gh on 2017-10-10 15:04
 */

class BaseController {

    /**
     * 构造
     */
    constructor(req) {
    }

    /**
     * 参数有效性检验
     * @param params
     * @param callback
     */
    checkParam(params, callback) {

    }

    /**
     * 检查值是否在范围之内
     * @param value
     * @param ranges
     * @returns {boolean}
     * @private
     */
    _checkValueRange(value, ranges) {
        return !ranges.some(el => el == value);
    }

    /**
     * 检查是否日期
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkDate(value) {
        return new Date(value) == 'Invalid Date';
    }

    /**
     * 检查身份证
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkIdentity(value) {
        return !(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/i.test(value));
    }

    /**
     * 检查手机号
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkPhone(value) {
        return !/^1\d{10}$/.test(value);
    }

    /**
     *接口返回对象
     * @param err
     * @returns {{code: number, msg: *}}
     */
    getReturnObj(err) {
        let returnObj = {
            code: 200,
            msg: err,
        };
        if (err) {
            returnObj.code = 500;
        }
        return returnObj;
    }

    /**
     * 分页对象
     * @param pageNo 第几页 从1开始
     * @returns {{page_start: number, page_size: number}}
     */
    getPageObj(pageNo) {
        return {
            page_start: (pageNo * this.DEFAULT_PAGE_SIZE) - this.DEFAULT_PAGE_SIZE,
            page_size: this.DEFAULT_PAGE_SIZE,
        }
    }

    /*
     * 去除字符串中空格
     * */
    trimString(str, is_global) {
        let result;
        result = str.replace(/(^\s+)|(\s+$)/g, '');
        if (is_global.toLowerCase() == 'g') {
            result = result.replace(/\s/g, '');
        }
        return result;
    }
}

module.exports = BaseController;