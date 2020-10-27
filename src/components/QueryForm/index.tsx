
import React, {useState, ReactNode, useImperativeHandle} from 'react';
import { Form, Input, Button, Select, Row, Col, DatePicker, TimePicker, Cascader,Radio} from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons';
import { Rule } from 'antd/es/form';
import classnames from 'classnames';
import styles from './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

/**
 * select类型枚举
 * @param label 选项文案
 * @param value 选项值
 */
interface SelectOptionValueEnum {
    label: string,
    value: any
}

/**
 * 查询表单项
 * @param title 查询名称
 * @param formItemTitle 查询名称，没有则取title字段
 * @param dataIndex 查询字段
 * @param hideInForm 是否在表单中显示
 * @param queryType 查询类型
 * @param valueEnum select选项枚举
 * @param rules 查询规则
 * @param formItemProps 透传属性
 * @param formItemStyle 查询项样式
 * @param renderFormItem 自定义表单渲染，返回form对象，用于更新表单信息
 */
export interface QueryFormItem {
    title?: string,
    formItemTitle?: string
    dataIndex: string,
    hideInForm?: boolean,
    queryType?: "text" | "select" | "datePicker" | "rangePicker" | "timePicker" | "cascader" | "render"| "radio",
    formItemProps?: any,
    formItemStyle?: any;
    valueEnum?: SelectOptionValueEnum[],
    rules?: Array<Rule>,
    renderFormItem?: (form: any) => ReactNode
}

/**
 * 查询表单属性
 * @param columns 查询数据项
 * @param freeLayout 自由布局开关
 * @param advance 高级搜索显示个数，0为不进行高级搜索
 * @param initialValues 表单初始值
 * @param hideForm 隐藏表单
 */
interface QueryFormProps {
    columns: QueryFormItem[];
    freeLayout?: boolean;
    advance?: number;
    onSuccess?: (values: any) => void;
    onError?: (err: any) => void;
    initialValues?: any;
    hideForm?: boolean
}

const QueryForm: React.FC<QueryFormProps> = React.forwardRef( (props, ref) => {
    const { columns = [], advance, onSuccess = () => { }, onError = () => { }, initialValues, hideForm } = props;
    const [form] = Form.useForm();
    const [collapse, setCollapse] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            // 重置搜索选项
            reset: () => {
                resetForm()
            },
            getFromData: () => {
                return form.getFieldsValue();
            }
        }
    });

    // 查询成功回调
    const onFinish = (values: any) => {
        const result = {};
        for (const key in values) {
            if (values[key] || typeof values[key] === 'number') {
                result[key] = values[key];
            }
        }
        onSuccess(result);
    };

    // 查询错误回调
    const onFinishFailed = (err: any) => {
        onError(err);
    }

    // 重置
    const resetForm = () => {
        form.resetFields();
    }

    // 设置查询项
    const setQueryItem = (item: QueryFormItem) => {
        let queryItem: any = null;
        let props = { allowClear: true, ...item.formItemProps };
        switch (item.queryType) {
            case 'text':
                queryItem = <Input {...props} type="text" />;
                break;
            case 'select':
                const valueEnum = item.valueEnum || [];
                queryItem = <Select getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props}>
                    {
                        valueEnum.map((opt, index) => {
                            return <Option value={opt.value} key={index}>{opt.label}</Option>;
                        })
                    }
                </Select>;
                break;
            case 'datePicker':
                queryItem = <DatePicker getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props}></DatePicker>;
                break;
            case 'rangePicker':
                queryItem = <RangePicker getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props}></RangePicker>;
                break;
            case 'timePicker':
                queryItem = <TimePicker getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props}></TimePicker>;
                break;
            case 'cascader':
                queryItem = <Cascader getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props} />;
                break;
           case 'radio':
               const valueEnumItem= item.valueEnum|| []
                queryItem = <Radio.Group getPopupContainer={triggerNode => document.getElementById("queryForm")} {...props} >
                    {valueEnumItem.map((radioItem,index)=>{
                        return <Radio value={radioItem.value} key={index}>{radioItem.label}</Radio>
                    })}
                </Radio.Group>;
                break;
            case 'render':
                queryItem = typeof item.renderFormItem === 'function' ? item.renderFormItem(form) : null;
                break;
            default:
                queryItem = <Input {...props} type="text" />;
                break;
        }

        return <FormItem name={item.dataIndex} label={item.formItemTitle || item.title} rules={item.rules}>{queryItem}</FormItem>;
    }

    return (
        <div className={styles.queryForm} id="queryForm" hidden={hideForm}>
            <Form initialValues={initialValues} form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Row>
                    {
                        columns.filter(item => !item.hideInForm).map((item, index) => {
                            let qi: any = null;
                            if (!collapse && advance) {
                                qi = <Col key={item.dataIndex} style={item.formItemStyle} hidden={index + 1 > advance}>
                                    {setQueryItem(item)}
                                </Col>;
                            } else {
                                qi = <Col key={item.dataIndex} style={item.formItemStyle}>
                                    {setQueryItem(item)}
                                </Col>;
                            }
                            return qi;
                        })
                    }
                    <Col>
                        <div className={styles.formBtn}>
                            <Button icon={<SearchOutlined />} type="primary" htmlType="submit">搜索</Button>
                            <Button icon={<ReloadOutlined />} htmlType="reset" onClick={resetForm}>重置</Button>
                            {
                                advance ? <a style={{ marginLeft: 5 }} onClick={() => setCollapse(!collapse)}>{collapse ? "收起" : "展开"}<span className={collapse ? classnames(styles.collapse, styles.open) : styles.collapse}><DownOutlined /></span></a> : ""
                            }
                        </div>
                    </Col>
                </Row>
            </Form>
        </div >
    );
})

export default QueryForm;
