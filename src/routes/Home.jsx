import {Flex} from "antd";
import {DatePicker} from "jalaali-react-date-picker";
import "jalaali-react-date-picker/lib/styles/index.css";

function Home() {

    return (
        <Flex align={"center"} justify="center">
            <DatePicker/>
        </Flex>
    );
}

export default Home;