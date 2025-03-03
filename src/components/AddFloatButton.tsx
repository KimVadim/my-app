import React from "react"
import { FloatButton } from "antd";
import { DollarOutlined, FileDoneOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';

interface AddFloatButtonProps {
    setIsAddOpty: (isOpen: boolean) => void;
    setIsAddPayment: (isOpen: boolean) => void;
    setIsAdExpense: (isOpen: boolean) => void;
}

export const AddFloatButton: React.FC<AddFloatButtonProps> = ({setIsAddOpty, setIsAddPayment, setIsAdExpense}) => {
    return (
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<PlusOutlined />}
        >
            <FloatButton icon={<FileDoneOutlined />} onClick={() => setIsAddOpty(true)} />
            <FloatButton icon={<DollarOutlined />} onClick={() => setIsAddPayment(true)}/>
            <FloatButton icon={<WalletOutlined />} onClick={() => setIsAdExpense(true)}/>
        </FloatButton.Group>
    );
}