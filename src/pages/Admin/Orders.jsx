import OrdersComponent from "./OrdersComponent"
import useDocumentTitle from "../../utils/UseDocumentTitle"
import { Container } from "@mui/material"

const Orders = () => {
  useDocumentTitle('Orders')
  return (
    <Container>
      <OrdersComponent/>
    </Container>
  )
}
export default Orders