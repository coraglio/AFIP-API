let params = {
	auth: {
		key: "Auth",
		token: "Token",
		sign: "Sign",
	},
	params: {
		Auth: {
			Cuit: "000000000",
		},
		FeCAEReq: {
			FeCabReq: {
				CantReg: 1,
				PtoVta: 1,
				CbteTipo: 11, // 11 Factura C
			},
			FeDetReq: {
				FECAEDetRequest: [
					{
						Concepto: 3, // 1 Productos, 2 Servicios, 3 Productos y Servicios
						DocTipo: 99, // 96 DNI, 99 otro
						DocNro: 0,
						CbteDesde: 1,
						CbteHasta: 99999999,
						CbteFch: "20210227", // yyyymmdd
						ImpTotal: 15.45,
						ImpTotConc: 0, //Importe neto no gravado. Para comprobantes tipo C debe ser igual a cero (0)
						ImpNeto: 15.45, //Importe neto  gravado. Debe ser menor o igual a Importe total y no puede ser menor a cero. Para comprobantes tipo C este campo corresponde al Importe del SubTotal.
						ImpOpEx: 0, //Importe exento. Para comprobantes tipo C debe ser igual a cero (0)
						ImpTrib: 0, //Suma de los importes del  array de tributos
						ImpIVA: 0, //Suma de los importes del  array de IVA. Para comprobantestipo C debe ser igual a cero (0).
						// "FchServDesde": "s:string", // yyyymmdd
						// "FchServHasta": "s:string", // yyyymmdd
						// "FchVtoPago": "s:string", // yyyymmdd
						MonId: "PES", // Pesos Argentinos
						MonCotiz: 1,
						CbtesAsoc: [
							{
								Tipo: "s:int",
								PtoVta: "s:int",
								Nro: "s:long",
								Cuit: "s:string",
								CbteFch: "s:string",
							},
						],
						Tributos: [
							{
								Id: "s:short",
								Desc: "s:string",
								BaseImp: "s:double",
								Alic: "s:double",
								Importe: "s:double",
							},
						],
						Iva: [
							{
								Id: "s:int",
								BaseImp: "s:double",
								Importe: "s:double",
							},
						],
						Opcionales: [
							{
								Id: "s:string",
								Valor: "s:string",
							},
						],
						Compradores: [
							{
								DocTipo: "s:int",
								DocNro: "s:long",
								Porcentaje: "s:double",
							},
						],
						PeriodoAsoc: {
							FchDesde: "s:string",
							FchHasta: "s:string",
						},
					},
				],
			},
		},
	},
};
