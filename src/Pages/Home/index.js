import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import do hook

import '../index.css';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
	const [NewPlan, setNewPlan] = useState('');
	const [Motivo, setMotivo] = useState('');
	let motivos = ['Insatisfação', 'Valor alto', 'Área de cobertura', 'Outro'];
	const [Estados, setEstados] = useState([{}]);
	const [Estado, setEstado] = useState('');
	const [Cidade, setCidade] = useState('');
	const [Cidades, setCidades] = useState([]);
	const [cidadesFind, setCidadesFind] = useState(false);
	const [infoAd, setInfoAd] = useState(false);
	const [nome, setNome] = useState('');
	const [telefone, setTelefone] = useState('');
	const [email, setEmail] = useState('');
	const [obs, setObs] = useState('');
	const [pref, setPref] = useState('');
	const [qt, setQt] = useState('');
	const [planoantigo, setplanoantigo] = useState('');
	const [CNPJ, setCNPJ] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch('./estados-cidades.json', {
			headers: {
				Accept: 'application/json',
			},
		})
			.then((res) => res.json())
			.then((res) => setEstados(res.estados));
	}, []);

	useEffect(() => {
		if (Estado) {
			function whatState(cidades) {
				return cidades.sigla === Estado;
			}
			setCidades(Estados.find(whatState).cidades);
			setCidadesFind(true);
		}
	}, [Estado]);

	let numberInput = '(99) 99999-9999';

	async function addClient(evt) {
		setLoading(true);
		if (nome && telefone && email) {
			let objInput = {
				NOME: nome,
				TELEFONE: telefone,
				EMAIL: email,
				LOCALIZACAO: Cidade + ' - ' + Estado,
				CNPJ: CNPJ,
				QT: qt,
				PREFERENCIA: pref,
				OBSERVACOES: obs,
				PLANOANTIGO: planoantigo,
				MOTIVO: Motivo,
				OK: false,
			};
			await axios.post(`${process.env.REACT_APP_ROUTE}/add`, objInput);
			setNome('');
			setTelefone('');
			setEmail('');
			setEstado('');
			setCidade('');
			setCNPJ('');
			setQt('');
			setPref('');
			setObs('');
			setplanoantigo('');
			setMotivo('');
			setLoading(false);
		} else {
			alert('Preencha os campos obrigatórios');
			setLoading(false);
		}
	}

	return (
		<>
			<div className="all">
				{loading == true ? (
					<div id="loading">
						<CircularProgress />
					</div>
				) : (
					''
				)}
				{infoAd ? (
					<div>
						<div className="add-info">
							<div className="titulo-info-ads">
								<div onClick={() => setInfoAd(false)} id="x">
									x
								</div>
								<div className="title">Informações adicionais</div>
							</div>

							<div className="question">Quantas pessoas participariam?</div>
							<TextField
								id="outlined-number"
								type="number"
								InputLabelProps={{
									shrink: true,
									pattern: '/^d+$/',
								}}
								onChange={(e) => setQt(e.target.value)}
								value={qt}
							/>
							<div className="question">Digite um plano de preferência:</div>
							<TextField
								id="outlined-basic"
								className="input-text"
								variant="outlined"
								onChange={(e) => setPref(e.target.value)}
								value={pref}
							/>
							<div className="question">Observações:</div>

							<TextField
								id="outlined-multiline-flexible"
								multiline
								maxRows={4}
								onChange={(e) => setObs(e.target.value)}
								value={obs}
							/>
							<div className="question">Já possui plano?</div>
							<FormControl className="selector">
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									defaultValue="female"
									name="radio-buttons-group"
									onChange={(e) => setNewPlan(e.target.value)}
								>
									<FormControlLabel
										value="Sim"
										control={<Radio />}
										label="Sim"
									/>
									<FormControlLabel
										value="Não"
										control={<Radio />}
										label="Não"
									/>
								</RadioGroup>
							</FormControl>
							{NewPlan == 'Sim' ? (
								<>
									<div className="question">Qual o motivo da troca?</div>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={Motivo}
										className="input-text-next"
										label="Age"
										onChange={(e) => setMotivo(e.target.value)}
									>
										{motivos.map((motivo) => {
											return <MenuItem value={motivo}>{motivo}</MenuItem>;
										})}
									</Select>
									<div className="question">Qual o plano antigo?</div>
									<TextField
										id="outlined-basic"
										className="input-text"
										variant="outlined"
										onChange={(e) => setplanoantigo(e.target.value)}
										value={planoantigo}
									/>
								</>
							) : (
								''
							)}
						</div>
					</div>
				) : (
					''
				)}
				<div className="home">
					<div className="titulo-geral">COTAÇÃO DE PLANOS DE SAÚDE</div>
					<div className="center">
						<div className="title">Informações básicas</div>

						<div className="question">
							Qual é o seu nome? <spam className="asterisco">*</spam>
						</div>
						<TextField
							id="outlined-basic"
							className="input-text"
							label="Nome"
							required={true}
							variant="outlined"
							onChange={(e) => setNome(e.target.value)}
							value={nome}
						/>
						<div className="question">
							Digite seu telefone: <spam className="asterisco">*</spam>
						</div>
						<TextField
							id="outlined-basic"
							className="input-text"
							label="Telefone"
							variant="outlined"
							placeholder={numberInput}
							onChange={(e) => setTelefone(e.target.value)}
							value={telefone}
						/>
						<div className="question">
							Qual o seu email? <spam className="asterisco">*</spam>
						</div>
						<TextField
							id="outlined-basic"
							className="input-text"
							label="Email"
							variant="outlined"
							placeholder="exemple@email.com"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>

						<div id="next">
							<div id="next-box1">
								<div className="question">Qual o seu estado?</div>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={Estado}
									className="input-text-next"
									label="Age"
									onChange={(e) => setEstado(e.target.value)}
								>
									{Estados.map(function (item, indice) {
										return <MenuItem value={item.sigla}>{item.sigla}</MenuItem>;
									})}
								</Select>
							</div>
							{cidadesFind ? (
								<div id="next-box2">
									<div className="question">Qual a sua cidade?</div>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={Cidade}
										className="input-text-next"
										label="Age"
										onChange={(e) => setCidade(e.target.value)}
									>
										{Cidades.map((cidade) => {
											return <MenuItem value={cidade}>{cidade}</MenuItem>;
										})}
									</Select>
								</div>
							) : (
								''
							)}
						</div>
						<div className="question">Possui CNPJ?</div>
						<FormControl>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								name="radio-buttons-group"
								onChange={(e) => setCNPJ(e.target.value)}
								value={CNPJ}
							>
								<FormControlLabel value="Sim" control={<Radio />} label="Sim" />
								<FormControlLabel value="Não" control={<Radio />} label="Não" />
							</RadioGroup>
						</FormControl>
						<div id="buttons">
							<div id="add-info" onClick={() => setInfoAd(true)}>
								Adicionar Informações
							</div>
							<Button onClick={() => addClient()} variant="contained">
								Enviar
							</Button>
						</div>
						<div className="campo">
							<spam className="asterisco">* </spam> Campo obrigatório
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
