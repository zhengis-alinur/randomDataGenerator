import React, { useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setErrors, setRegion, setSeed, setData } from '../redux/reducers/table';
import { generateUsers } from '../utils';
import { PER_PAGE } from '../constants';

const Toolbar = () => {
	const dispatch = useAppDispatch();
	const region = useAppSelector((state) => state.table.region)
	const errors = useAppSelector((state) => state.table.errors)
	const seed = useAppSelector((state) => state.table.seed)
	const data = useAppSelector((state) => state.table.data)
	const currentPage = useAppSelector((state) => state.table.currentPage)

	useEffect(() => {
		const lastPage = generateUsers({region, seed: seed + currentPage, errors})
		dispatch(setData([...data.slice(0,-10), ...lastPage]))
	}, [seed]);

	useEffect(() => {
		const newRegionData = generateUsers({region, seed, length: data.length, errors})
		dispatch(setData(newRegionData))
	}, [region]);

	const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  	dispatch(setRegion(event.target.value))
	};
  
	const handleErrorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const errorCount = parseFloat(event.target.value);
		if(errorCount > 1000) return;
		const lastPage = generateUsers({
			region, seed: seed + currentPage, errors: errorCount
		})
		dispatch(setData([...data.slice(0,-10), ...lastPage]))
		dispatch(setErrors(errorCount));
	};

	const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSeed(parseInt(event.target.value)));
  };
  
	return (
		<Form  className='toolbar position-sticky top-0 p-0 m-0 w-100'>
			<Row className='d-flex justify-content-between align-items-center w-100'>
			<Col xs="auto">
				<Form.Group controlId="regionSelector" className='form-group'>
				<Form.Label>Region</Form.Label>
				<Form.Control as="select" value={region} onChange={handleRegionChange}>
					<option value="en_US">USA</option>
					<option value="ru">Russia</option>
					<option value="lv">Latvia</option>
				</Form.Control>
				</Form.Group>
			</Col>
			<Col xs="auto" className='d-flex align-items-center gap-4'>
				<Form.Group controlId="textInput" className='form-group'>
				<Form.Label>Errors</Form.Label>
				<Form.Control
					type="number"
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
				<Form.Group controlId="textInput" className='form-group'>
				<Form.Label>Seed</Form.Label>
				<Form.Control
					type="number"
					onChange={handleSeedChange}
					placeholder="Enter value"
				/>
				</Form.Group>
			</Col>
			</Row>
		</Form>
	)
}

export default Toolbar
