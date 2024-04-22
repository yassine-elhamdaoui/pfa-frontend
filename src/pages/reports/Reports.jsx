import { useEffect } from "react";
import { getJoinRequests } from "../../services/joinRequestsService";

const token = localStorage.getItem("token");
function Reports() {
  const [joinRequests, setJoinRequests] = useState([]);
  useEffect(() => {
    function fetchData(){
      const data = getJoinRequests(token);
      setJoinRequests(data);
    }
    fetchData();
  }, []);
  return (
    <div>Reports</div>
  )
}

export default Reports;