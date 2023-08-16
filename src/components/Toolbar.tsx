import React, { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setErrors,
    setRegion,
    setSeed,
    setData,
} from '../redux/reducers/table';
import { downloadBlob, generateUsers } from '../utils';
import { REGIONS_MAP } from '../constants';
import { Region } from '../types';
import {
    selectRegion,
    selectErrors,
    selectSeed,
    selectData,
    selectCurrentPage,
} from '../selectors';

const Toolbar = () => {
    const dispatch = useAppDispatch();
    const region = useAppSelector(selectRegion);
    const errors = useAppSelector(selectErrors);
    const seed = useAppSelector(selectSeed);
    const data = useAppSelector(selectData);
    const currentPage = useAppSelector(selectCurrentPage);

    useEffect(() => {
        const lastPage = generateUsers({
            region,
            seed: seed + currentPage,
            errors,
        });
        dispatch(setData([...data.slice(0, -10), ...lastPage]));
    }, [seed]);

    useEffect(() => {
        const newRegionData = generateUsers({
            region,
            seed,
            length: data.length,
            errors,
        });
        dispatch(setData(newRegionData));
    }, [region]);

    const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRegion(event.target.value));
    };

    const handleErrorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const errorCount = parseFloat(event.target.value);
        if (errorCount > 1000) return;
        const lastPage = generateUsers({
            region,
            seed: seed + currentPage,
            errors: errorCount,
        });
        dispatch(setData([...data.slice(0, -10), ...lastPage]));
        dispatch(setErrors(errorCount));
    };

    const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSeed(parseInt(event.target.value)));
    };

    const setRandomSeed = () => {
        dispatch(setSeed(Math.floor(Math.random() * 1000)));
    };

    const handleCSVExport = () => {
        downloadBlob(data);
    };

    return (
        <Form className="toolbar position-sticky top-0 p-0 m-0 w-100">
            <Row className="d-flex justify-content-between align-items-center w-100">
                <Col xs="auto">
                    <Form.Group
                        controlId="regionSelector"
                        className="form-group"
                    >
                        <Form.Label>Region</Form.Label>
                        <Form.Control
                            as="select"
                            value={region}
                            onChange={handleRegionChange}
                        >
                            {Object.keys(REGIONS_MAP).map((key, index) => (
                                <option key={index} value={key}>
                                    {REGIONS_MAP[key as Region]}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs="auto" className="d-flex align-items-center gap-4">
                    <Form.Group controlId="textInput" className="form-group">
                        <Form.Label>Errors</Form.Label>
                        <Form.Control
                            type="number"
                            onChange={handleErrorsChange}
                            placeholder="Enter value"
                        />
                    </Form.Group>
                    <Form.Group controlId="sliderInput">
                        <Form.Control
                            step="0.01"
                            type="range"
                            min="0"
                            max="10"
                            value={errors}
                            onChange={handleErrorsChange}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Form.Group controlId="textInput" className="form-group">
                        <Form.Label>Seed</Form.Label>
                        <Form.Control
                            type="number"
                            onChange={handleSeedChange}
                            value={seed === 0 ? 0 : seed}
                            placeholder="Enter value"
                        />
                        <Form.Control
                            type="button"
                            onClick={() => {
                                setRandomSeed();
                            }}
                            value="Random"
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Form.Group controlId="textInput" className="form-group">
                        <Form.Control
                            type="button"
                            onClick={() => {
                                handleCSVExport();
                            }}
                            value="Export to CVS"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default Toolbar;
