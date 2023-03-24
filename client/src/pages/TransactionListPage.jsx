import { useEffect, useState } from "react";
import { Button, Container, Dropdown, Form, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import ModalDetailTransaction from "../components/modal/ModalDetailTransaction";
import ModalFailed from "../components/modal/ModalFailed";
import { API } from "../config/api";
import { ConvertFormatRupiah } from "../utils";

export default function TransactionListPage() {
  const title = "Transactions";
  document.title = "Waysbeans | " + title;
  const [filterState, setFilter] = useState(0);
  const [filterForm, setFilterForm] = useState(null);
  const [routing, setRouting] = useState("/transactions");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orderID, setOrderID] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const handleShowDetail = () => setShowDetail(true);
  const handleCloseDetail = () => setShowDetail(false);
  const [transactionDetail, setTransactionDetail] = useState(null);

  let { data: transactions, refetch } = useQuery(
    "transactionListCache",
    async () => {
      console.log("Routing", routing);
      const response = await API.get(routing);

      console.log(response);
      return response.data.data;
    }
  );

  useEffect(() => {
    setRouting("/transactions");
  }, []);

  useEffect(() => {
    refetch();
  }, [routing]);

  return (
    <>
      <Container className="p-5">
        <h1>Income Transaction</h1>
        <Table
          style={{ fontSize: "14px" }}
          className="mt-4"
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th style={{ width: "130px" }}>Order Number</th>
              <th style={{ textAlign: "start", width: "190px" }}>Name</th>
              <th style={{ textAlign: "start", width: "280px" }}>Address</th>
              <th style={{ textAlign: "start", width: "100px" }}>Post Code</th>
              <th style={{ textAlign: "start", width: "90px" }}>Total Qty</th>
              <th style={{ textAlign: "start", width: "90px" }}>
                Total Amount
              </th>
              <th style={{ textAlign: "start", width: "160px" }}>Products</th>
              <th style={{ textAlign: "center", width: "190px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <>
              {transactions?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.post_code}</td>
                  <td
                    className="fw-bold fs-5"
                    style={{ textAlign: "center", width: "90px" }}
                  >
                    {item.total_qty}
                  </td>
                  <td
                    className="fw-bold fs-6"
                    style={{ textAlign: "start", width: "90px" }}
                  >
                    {ConvertFormatRupiah(item.sub_total)}
                  </td>
                  <td className="d-flex justify-content-center">
                    {item.carts?.length > 0 ? (
                      <Button
                        variant="success"
                        onClick={() => {
                          setTransactionDetail(item);
                          handleShowDetail();
                        }}
                      >
                        Product Detail
                      </Button>
                    ) : (
                      <Button variant="danger" disabled>
                        Empty Cart
                      </Button>
                    )}
                  </td>

                  <td style={{ textAlign: "center", width: "190px" }}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </>
          </tbody>
        </Table>
      </Container>

      <ModalDetailTransaction
        show={showDetail}
        onHide={handleCloseDetail}
        transaction={transactionDetail}
      />
    </>
  );
}
