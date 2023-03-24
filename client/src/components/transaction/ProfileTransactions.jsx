import { ConvertFormatRupiah, ConvertFormatDate } from "../../utils";
import { Card, Row, Col } from "react-bootstrap";
import Brand from "../../components/brand/Brand";
import TransactionDetail from "./TransactionDetail";

export default function ProfileTransactions({ transactions }) {
  return (
    <>
      {transactions?.length !== 0 ? (
        <>
          {transactions?.map((transaction, index) => (
            <div className="mb-3">
              <TransactionDetail index={index} transaction={transaction} />
            </div>
          ))}
        </>
      ) : (
        <>
          <p>There is no order</p>
        </>
      )}
    </>
  );
}
