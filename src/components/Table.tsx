import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useAppSelector } from '../redux/hooks';
import { useDispatch } from 'react-redux';
import { generateUsers } from '../utils';
import { incrementPage, setData } from '../redux/reducers/table';
import {
    selectData,
    selectRegion,
    selectSeed,
    selectCurrentPage,
} from '../selectors';

const View = () => {
    const ref = useRef<HTMLTableElement>(null);
    const dispatch = useDispatch();
    const data = useAppSelector(selectData);
    const region = useAppSelector(selectRegion);
    const seed = useAppSelector(selectSeed);
    const currentPage = useAppSelector(selectCurrentPage);

    const [isBottom, setIsBottom] = useState(false);

    const fetchMoreData = () => {
        dispatch(
            setData(
                data.concat(generateUsers({ region, seed: seed + currentPage }))
            )
        );
        dispatch(incrementPage());
    };

    useEffect(() => {
        if (isBottom) fetchMoreData();
    }, [isBottom]);

    useEffect(() => {
        document.addEventListener('wheel', (event) => {
            if (
                event.deltaY > 0 &&
                window.scrollY >=
                    document.documentElement.scrollHeight - window.innerHeight
            ) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
        });
    }, []);

    return (
        <Table striped bordered hover className="mb-5" ref={ref}>
            <thead>
                <tr>
                    <th>Номер</th>
                    <th>Идентификатор</th>
                    <th>ФИО</th>
                    <th>Адрес</th>
                    <th>Телефон</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.address}</td>
                        <td>{row.phone}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default View;
