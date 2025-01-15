
import CustomerReview from "../CustomerReview/CustomerReview";
import Updates from "../Updates/Updates";
import '../../assets/styles/MainDash.css'

const RightSide = () => {
  return (
    <div className="RightSide mt-2">
      <div>
        <h3 class="mb-2 text-md font-semibold text-dark">Team members</h3>
        <Updates />
      </div>
      {/* <div>
        <h3 class="mb-2 text-md font-semibold text-dark">Reports</h3>
        <CustomerReview />
      </div> */}
    </div>
  );
};

export default RightSide;
