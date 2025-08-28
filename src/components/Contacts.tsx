import { Col, Row, Spin, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { contactMeta } from "./AllApplicationMeta.tsx";
import { ContactFieldData, FieldPlaceholder, ModalTitle } from "../constants/appConstant.ts";
import { AddFloatButton } from "./AddFloatButton.tsx";
import { AddContactModal } from "./AddContactModal.tsx";
import { MenuComp } from "./Menu.tsx";

export const Contacts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const contactAllData = useSelector((state: RootState) => state.contact.contact);
  const [isAddContact, setIsAddContact] = useState(false);
  const contactData = contactAllData.filter((x) => x[ContactFieldData.Type] !== 'Renter');
  contactData.sort((a, b) => a[ContactFieldData.Type].localeCompare(b[ContactFieldData.Type]));

  useEffect(() => {
    if (searchText) {
      const filtered = contactData.filter((item) =>
      item[ContactFieldData.FirstName]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item[ContactFieldData.Type]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item[ContactFieldData.Phone]?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(contactData);
    }
  }, [searchText, contactAllData]);

  const actions = {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
  };

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Row align="middle" gutter={15} style={{ marginBottom: 16 }}>
          <Col flex="auto" style={{ maxWidth: "111px" }}>
            <MenuComp/>
          </Col>
          <Col>
            <strong>{ModalTitle.Contacts}</strong>
          </Col>
          <Col>
            <Input
              placeholder={FieldPlaceholder.EnterContactData}
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 170 }}
            />
          </Col>
        </Row>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          columns={contactMeta}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                {record?.[ContactFieldData.Description]}
              </p>
            ),
            rowExpandable: (record) => !!record?.[ContactFieldData.Description],
          }}
          size="middle"
          pagination={{
            position: ["bottomCenter"],
            pageSize: 100,
          }}
        />
        <AddFloatButton
          setIsAddContact={setIsAddContact}
        />
        {isAddContact && <AddContactModal
          setIsAddContact={setIsAddContact} isAddContact={isAddContact} setLoading={setLoading} loading={loading}
        />}
      </Spin>
    </div>
  );
};