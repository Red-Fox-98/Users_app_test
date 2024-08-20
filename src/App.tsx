import {requestUsers, requestUsersWithError, User} from "./api";
import "./styles.css";
import {useEffect, useState} from "react";
import {getPage} from "./helpers";

// Примеры вызова функций, в консоли можно увидеть возвращаемые результаты
// requestUsers({ name: "", age: "", limit: 4, offset: 0 }).then(console.log);
// requestUsersWithError({ name: "", age: "", limit: 4, offset: 0 }).catch(
//   console.error
// );

interface Filter {
    name: string;
    age: string;
}

interface MessageI {
    isLoading: boolean;
    isNotFound: boolean;
    errorMessage: string;
}

interface PaginateI {
    limit: number;
    page: number;
}

export default function App() {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [filter, setFilter] = useState<Filter>({age: "", name: ""})
    const [message, setMessage] = useState<MessageI>({isLoading: false, isNotFound: false, errorMessage: ""});
    const [paginate, setPaginate] = useState<PaginateI>({limit: 1, page: 1});
    const selectNumber = [1, 2, 3, 4, 5];

    useEffect(() => {
        getMessage(true, false, "");
        const offset = (paginate.page - 1) * paginate.limit;
        if (!Number.isNaN(+filter.age)) {
            requestUsers({name: filter.name, age: filter.age, limit: paginate.limit, offset: offset}).then((data) => {
                setUsersData(data);
                getMessage(false, data.length === 0, "");
            });
        } else {
            requestUsersWithError({
                name: filter.name,
                age: filter.age,
                limit: paginate.limit,
                offset: offset
            }).catch((e) => {
                getMessage(false, false, e.toString());
            });
        }

    }, [filter, paginate]);

    const getMessage = (isLoading: boolean, isNotFound: boolean, errorMessage: string) => {
        setMessage(prevState => {
            return {
                isLoading: isLoading,
                isNotFound: isNotFound,
                errorMessage: errorMessage,
            }
        })
    }

    const search = (name = "", age = "") => {
        setFilter(prevState => {
            return {
                name: name,
                age: age,
            }
        })
    };

    const paginateChange = (limit: number, op: string) => {
        setPaginate(prevState => {
            return {
                limit: limit,
                page: op !== "" ? getPage(op, prevState.page) : prevState.page
            };
        })
    }

    return (
        <div className={'users'}>
            <div className={'content'}>
                <div className={'data-entry'}>
                    <input placeholder={"Name"}
                           onChange={(event) => search(event.currentTarget.value, filter.age)}></input>
                    <input placeholder={"Age"}
                           onChange={(event) => search(filter.name, event.currentTarget.value)}></input>
                </div>
                <div className={'inputs'}>
                    {message.isLoading && <code>Loading...</code>}
                    {message.isNotFound && <code>Users not found</code>}
                    {message.errorMessage.toString() !== "" && <code>{message.errorMessage}</code>}
                    {(!message.isLoading && message.errorMessage === "") && usersData.map((user) =>
                        <div key={user.id}>{`${user.name}, ${user.age}`}</div>
                    )}
                </div>
                <div className={'buttons'}>
                    {'By page: '}
                    <select onChange={(event) => paginateChange(+event.currentTarget.value, "")}>
                        {selectNumber.map((n) =>
                            <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button onClick={() => paginateChange(paginate.limit, '-')}>prev</button>
                    {`page: ${paginate.page}`}
                    <button onClick={() => paginateChange(paginate.limit, '+')}>next</button>
                </div>
            </div>
        </div>
    )
}
