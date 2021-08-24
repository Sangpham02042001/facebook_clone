import { Avatar } from "antd";
import { baseURL } from "../../utils/axios.util";
import Link from 'next/link';

const AvatarProfile = (props) => {

    return (
        <Link href={`/profile/${props.user._id}`}>
            <a>
                <Avatar
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                    src={`${baseURL}/api/user/avatar/${props.user._id}`} />
                {props.showName && <span style={{ fontSize: "20px", fontWeight: "bold" }}>{props.user.name}</span>}
            </a>
        </Link>
    );

}

export default AvatarProfile