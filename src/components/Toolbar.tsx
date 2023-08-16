import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setErrors,
    setRegion,
    setSeed,
    setData,
    updateData,
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

    const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as Region;
        dispatch(setRegion(value));
        dispatch(
            setData(
                generateUsers({
                    region: value,
                    seed,
                    length: data.length,
                    errors,
                })
            )
        );
    };

    const handleErrorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (value > 1000) return;
        dispatch(isNaN(value) ? setErrors(0) : setErrors(value));

        dispatch(
            updateData(
                generateUsers({
                    region,
                    seed: seed + currentPage,
                    errors: value,
                })
            )
        );
    };

    const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        isNaN(value) ? dispatch(setSeed(0)) : dispatch(setSeed(value));

        dispatch(
            updateData(
                generateUsers({
                    region,
                    seed: value + currentPage,
                    errors,
                })
            )
        );
    };

    const handleRandomSeedClick = () => {
        const value = Math.floor(Math.random() * 1000);
        dispatch(setSeed(value));

        dispatch(
            updateData(
                generateUsers({
                    region,
                    seed: value + currentPage,
                    errors,
                })
            )
        );
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
                            type="text"
                            onChange={handleErrorsChange}
                            value={errors}
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
                            type="text"
                            onChange={handleSeedChange}
                            value={seed}
                            placeholder="Enter value"
                        />
                        <Form.Control
                            type="button"
                            onClick={handleRandomSeedClick}
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
