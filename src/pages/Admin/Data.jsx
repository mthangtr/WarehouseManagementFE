import DataComponent from "./DataComponent"
import useDocumentTitle from "../../utils/UseDocumentTitle"

const Data = () => { 
  useDocumentTitle('Data')
  return (
    <div><DataComponent/></div>
  )
}
export default Data