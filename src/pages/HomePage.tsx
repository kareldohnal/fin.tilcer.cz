import {Button, Col, DatePicker, Form, FormProps, InputNumber, message, Row, Typography} from "antd";
import {useEffect, useState} from "react";
import dayjs from 'dayjs';
import "./homePage.scss"

const {Title} = Typography;

type FieldType = {
    incomeKaja: number;
    incomeAndy: number;
    wantsKaja: number;
    wantsAndy: number;
    funSavings: number;
    noFunSavings: number;
};

const HomePage = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [date, setDate] = useState(dayjs());

    // Initial incomes
    const [income, setIncome] = useState({kaja: 0, andy: 0});
    // Split percentages
    const [splits, setSplits] = useState({
        needs: 60,
        wants: 20,
        funSavings: 10,
        noFunSavings: 10,
    });

    const handleIncomeChange = (field: 'kaja' | 'andy', value: number) => {
        setIncome(prev => ({...prev, [field]: value || 0}));
    };

    const handleSplitChange = (field: keyof typeof splits, value: number) => {
        setSplits(prev => ({...prev, [field]: value || 0}));
    };

    const calculateTotal = (percentage: number) => {
        const totalIncome = income.kaja + income.andy;
        return (totalIncome * percentage) / 100;
    };

    useEffect(() => {
        form.setFieldsValue({
            needs: Math.floor((income.kaja / (income.kaja + income.andy || 1)) * calculateTotal(splits.needs)),
            wantsKaja: Math.floor((income.kaja / (income.kaja + income.andy || 1)) * calculateTotal(splits.wants) / 2),
            wantsAndy: Math.floor((income.kaja / (income.kaja + income.andy || 1)) * calculateTotal(splits.wants) / 2),
            funSavings: Math.floor((income.kaja / (income.kaja + income.andy || 1)) * calculateTotal(splits.funSavings)),
            noFunSavings: Math.floor((income.kaja / (income.kaja + income.andy || 1)) * calculateTotal(splits.noFunSavings)),
        });
    }, [income.andy, income.kaja, splits]);

    const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
        // Check split
        if (splits.needs + splits.wants + splits.funSavings + splits.noFunSavings !== 100) {
            messageApi.open({
                type: 'error',
                content: 'Procentuální split nadává dohromady 100%.',
                duration: 5,
            });
            return;
        }

        console.log(values)
    }

    return (
        <div className={"homepage"}>
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{date: date}}>
                <Title level={3}>Budget Split</Title>

                <Row gutter={16}>
                    <Col span={8} style={{marginTop: 4}}><b>Month</b></Col>
                    <Col span={8}>
                        <Form.Item name="date">
                            <DatePicker picker="month" value={date} onChange={(date) => setDate(date)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16} style={{padding: 8}}>
                    <Col span={8}></Col>
                    <Col span={8}><b>Kája</b></Col>
                    <Col span={8}><b>Andy</b></Col>
                </Row>

                {/* Income Row */}
                <Row gutter={16}>
                    <Col span={8} style={{marginTop: 4}}><b>Income</b></Col>
                    <Col span={8}>
                        <Form.Item name="incomeKaja">
                            <InputNumber
                                style={{width: '100%'}}
                                value={income.kaja}
                                onChange={value => handleIncomeChange('kaja', value as number)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="incomeAndy">
                            <InputNumber
                                style={{width: '100%'}}
                                value={income.andy}
                                onChange={value => handleIncomeChange('andy', value as number)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Needs Row */}
                <Row gutter={16} style={{paddingTop: 16, paddingBottom: 16, borderTop: '1px solid #ccc'}}>
                    <Col span={8} style={{marginTop: 4}}><b>Needs</b></Col>
                    <Col span={16}>
                        <Form.Item name="needs">
                            <InputNumber
                                style={{width: '100%'}}
                                readOnly={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{textAlign: 'right', marginTop: '-24px'}}>
                        <span>Split %:</span>
                        <InputNumber
                            min={0}
                            max={100}
                            value={splits.needs}
                            onChange={value => handleSplitChange('needs', value as number)}
                            style={{width: '100px', marginLeft: 8}}
                        />
                    </Col>
                </Row>

                {/* Wants Row */}
                <Row gutter={16} style={{paddingTop: 16, paddingBottom: 16, borderTop: '1px solid #eee'}}>
                    <Col span={8} style={{marginTop: 4}}><b>Wants</b></Col>
                    <Col span={8}>
                        <Form.Item name="wantsKaja">
                            <InputNumber
                                style={{width: '100%'}}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="wantsAndy">
                            <InputNumber
                                style={{width: '100%'}}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{textAlign: 'right', marginTop: '-24px'}}>
                        <span>Split %:</span>
                        <InputNumber
                            min={0}
                            max={100}
                            value={splits.wants}
                            onChange={value => handleSplitChange('wants', value as number)}
                            style={{width: '100px', marginLeft: 8}}
                        />
                    </Col>
                </Row>

                {/* Fun Savings Row */}
                <Row gutter={16} style={{paddingTop: 16, paddingBottom: 16, borderTop: '1px solid #eee'}}>
                    <Col span={8} style={{marginTop: 4}}><b>Fun savings</b></Col>
                    <Col span={16}>
                        <Form.Item name="funSavings">
                            <InputNumber
                                style={{width: '100%'}}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{textAlign: 'right', marginTop: '-24px'}}>
                        <span>Split %:</span>
                        <InputNumber
                            min={0}
                            max={100}
                            value={splits.funSavings}
                            onChange={value => handleSplitChange('funSavings', value as number)}
                            style={{width: '100px', marginLeft: 8}}
                        />
                    </Col>
                </Row>

                {/* No Fun Savings Row */}
                <Row gutter={16} style={{paddingTop: 16, paddingBottom: 16, borderTop: '1px solid #eee'}}>
                    <Col span={8} style={{marginTop: 4}}><b>No fun savings</b></Col>
                    <Col span={16}>
                        <Form.Item name="noFunSavings">
                            <InputNumber
                                style={{width: '100%'}}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{textAlign: 'right', marginTop: '-24px'}}>
                        <span>Split %:</span>
                        <InputNumber
                            min={0}
                            max={100}
                            value={splits.noFunSavings}
                            onChange={value => handleSplitChange('noFunSavings', value as number)}
                            style={{width: '100px', marginLeft: 8}}
                        />
                    </Col>
                </Row>

                {/* Submit button */}
                <Col span={24} style={{textAlign: 'right', marginTop: 16}}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Form>
        </div>
    );
}

export default HomePage