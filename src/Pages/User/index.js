import React, { useEffect, useReducer, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // import do hook
import * as XLSX from 'xlsx';

import './index.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CircularProgress from '@mui/material/CircularProgress';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function User() {
	const [clientes, setClientes] = useState([]);
	const [adm, setadm] = useState(false);
	const [login, setLogin] = useState(false);
	const [email, setemail] = useState('');
	const [senha, setsenha] = useState('');
	const [Lista, setLista] = useState('3');
	const [check, setCheck] = useState(false);
	const [loading, setLoading] = useState(false);

	let date = new Date();
	let dia = date.getDate();
	let mes = date.getMonth() + 1;
	let ano = date.getFullYear();
	if (dia < 10) {
		dia = `0${dia}`;
	}
	if (mes < 10) {
		mes = `0${mes}`;
	}
	console.log(date.getMonth());
	useEffect(() => {
		fetch('./logins.json', {
			headers: {
				Accept: 'application/json',
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (login == true) {
					setLogin(false);
					for (let i in res) {
						if (res[i].login == email) {
							if (res[i].senha == senha) {
								setadm(true);
							}
						}
					}
				}
			});
	}, [login]);

	useEffect(() => {
		setLoading(true);
		getCaptacao();
	}, [check]);

	useEffect(() => {}, []);

	async function setChecked(cliente, e) {
		setCheck(!check);
		let objInput = {
			OK: e,
			id: cliente._id,
		};
		await axios.post(`${process.env.REACT_APP_ROUTE}/update`, objInput);
	}
	async function getCaptacao() {
		await axios
			.get(`${process.env.REACT_APP_ROUTE}/getClients`)
			.then((response) => {
				setClientes(response.data);
			});
		setLoading(false);
	}
	const clientId = process.env.REACT_APP_CLIENT_ID;

	const responseGoogle = (response) => {
		console.log(response, 'response');
	};
	async function readExcel(file) {
		const promise = new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = (e) => {
				const bufferArray = e.target.result;
				const wb = XLSX.read(bufferArray, { type: 'buffer' });
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				const data = XLSX.utils.sheet_to_json(ws);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
		promise.then((d) => {
			console.log(d);
		});
	}

	return (
		<div className="user">
			<div>OLA{process.env.REACT_APP_ROUTE}</div>
			{loading == true && adm == true ? (
				<div id="loading">
					<CircularProgress />
				</div>
			) : (
				''
			)}
			{adm == true ? (
				<div className="barra-de-navegacao">
					<div onClick={() => setLista('1')} className="icon">
						<CheckCircleIcon />
					</div>
					<div onClick={() => setLista('2')} className="icon">
						<CancelIcon />
					</div>
					<div onClick={() => setLista('3')} className="icon">
						<FormatListBulletedIcon />
					</div>
				</div>
			) : (
				''
			)}
			{adm == true ? (
				<div id="tabela">
					<table id="table">
						<ReactHTMLTableToExcel
							className="export-button"
							table="table"
							filename={`Captação ${dia}.${mes}.${ano}`}
							sheet="Sheet"
							buttonText=""
						/>

						<input
							type="file"
							id="contained-button-file"
							style={{ display: 'none' }}
							onChange={(e) => {
								const file = e.target.files[0];
								readExcel(file);
							}}
						/>
						<tr className="header-table">
							<td></td>
							<td>NOME</td>
							<td>EMAIL</td>
							<td>TELEFONE</td>
							<td>LOCALIZAÇÃO</td>
							<td>CNPJ</td>
							<td>QT. DE PESSOAS</td>
							<td>PREFERÊNCIA</td>
							<td>OBSERVAÇÕES</td>
							<td>PLANO ANTIGO</td>
							<td>MOTIVO DA DESISTÊNCIA</td>
						</tr>

						{Lista == '1' ? (
							<>
								{clientes.map((cliente) => {
									if (cliente.OK == true) {
										return (
											<tr className="lines">
												<td>
													{cliente.OK == true ? (
														<div id="no-color">true</div>
													) : (
														<div id="no-color">false</div>
													)}
													<Checkbox
														onChange={(e) =>
															setChecked(cliente, e.target.checked)
														}
														// checked={cliente.OK}
														defaultChecked={cliente.OK}
														// value={(e) => console.log(e, 'aa')}
													/>
												</td>
												<td>{cliente.NOME} </td>
												<td>{cliente.EMAIL} </td>
												<td>{cliente.TELEFONE}</td>
												<td>{cliente.LOCALIZACAO} </td>
												<td>{cliente.CNPJ} </td>
												<td>{cliente.QT} </td>
												<td>{cliente.PREFERENCIA} </td>
												<td id="obs">{cliente.OBSERVACOES} </td>
												<td>{cliente.PLANOANTIGO} </td>
												<td>{cliente.MOTIVO} </td>
												{/* <a
											target="_blank"
											href={`https://web.whatsapp.com/send?phone=${cliente.TELEFONE}&text&app_absent=0`}
										> */}
											</tr>
										);
									}
								})}
							</>
						) : (
							<>
								{Lista == '2' ? (
									<>
										{clientes.map((cliente) => {
											if (cliente.OK == false) {
												return (
													<tr className="lines">
														<td>
															{cliente.OK == true ? (
																<div id="no-color">true</div>
															) : (
																<div id="no-color">false</div>
															)}
															<Checkbox
																onChange={(e) =>
																	setChecked(cliente, e.target.checked)
																}
																// checked={cliente.OK}
																defaultChecked={cliente.OK}
																// value={(e) => console.log(e, 'aa')}
															/>
														</td>

														<td>{cliente.NOME} </td>
														<td>{cliente.EMAIL} </td>
														<td>{cliente.TELEFONE}</td>
														<td>{cliente.LOCALIZACAO} </td>
														<td>{cliente.CNPJ} </td>
														<td>{cliente.QT} </td>
														<td>{cliente.PREFERENCIA} </td>
														<td id="obs">{cliente.OBSERVACOES} </td>
														<td>{cliente.PLANOANTIGO} </td>
														<td>{cliente.MOTIVO} </td>
														{/* <a
											target="_blank"
											href={`https://web.whatsapp.com/send?phone=${cliente.TELEFONE}&text&app_absent=0`}
										> */}
													</tr>
												);
											}
										})}
									</>
								) : (
									<>
										{clientes.map((cliente) => {
											return (
												<tr className="lines">
													<td>
														{cliente.OK == true ? (
															<div id="no-color">true</div>
														) : (
															<div id="no-color">false</div>
														)}
														<Checkbox
															onChange={(e) =>
																setChecked(cliente, e.target.checked)
															}
															// checked={cliente.OK}
															defaultChecked={cliente.OK}
															// value={(e) => console.log(e, 'aa')}
														/>
													</td>
													<td>{cliente.NOME}sss </td>
													<td>{cliente.EMAIL} </td>
													<td>{cliente.TELEFONE}</td>
													<td>{cliente.LOCALIZACAO} </td>
													<td>{cliente.CNPJ} </td>
													<td>{cliente.QT} </td>
													<td>{cliente.PREFERENCIA} </td>
													<td id="obs">{cliente.OBSERVACOES} </td>
													<td>{cliente.PLANOANTIGO} </td>
													<td>{cliente.MOTIVO} </td>

													{/* <a
									target="_blank"
									href={`https://web.whatsapp.com/send?phone=${cliente.TELEFONE}&text&app_absent=0`}
								> */}
												</tr>
											);
										})}
									</>
								)}
							</>
						)}
					</table>
				</div>
			) : (
				<div className="login">
					<div className="title space">Login</div>
					<div className="email space">
						<TextField
							id="outlined-basic"
							className="input-text"
							label="Email"
							variant="outlined"
							placeholder="exemple@email.com"
							value={email}
							onChange={(e) => setemail(e.target.value)}
						/>
					</div>
					<div className="senha space">
						<TextField
							id="outlined-basic"
							className="input-text"
							label="Senha"
							variant="outlined"
							placeholder="********"
							type="password"
							value={senha}
							onChange={(e) => setsenha(e.target.value)}
						/>
					</div>
					<div className="entrar space">
						<Button onClick={() => setLogin(true)} variant="contained">
							Entrar
						</Button>
					</div>
					<GoogleLogin
						clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
						buttonText="Login"
						onSuccess={() => setadm(true)}
						onFailure={responseGoogle}
						cookiePolicy={'single_host_origin'}
						clientId={clientId}
					/>
				</div>
			)}
		</div>
	);
}
