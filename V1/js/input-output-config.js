/*-------------------------------Script con los valores de configuracion de los equipos--------------------------------*/

//Array con los valores de configuracion de las sondas
var aiConf = ["No usada",
	"Tª retorno colector frío",
	"Tª impulsión colector frío",
	"Tª depósito recuperación",
	"Tª retorno recuperación",
	"Tª impulsión colector calor",
	"Tª retorno colector calor",
	"Tª depósito ACS",
	"Velocidad bomba 1 G5",
	"Velocidad bomba 2 G5",
	"Velocidad bomba 1 G1",
	"Velocidad bomba 2 G1",
	"Velocidad bomba 1 G4",
	"Velocidad bomba 2 G4",
	"Tª impulsión ammolite",
	"Tª retorno ammolite",
	"P. impulsión ammolite",
	"P. retorno ammolite",
	"P. depósito recuperación",
	"P. impulsión BdC Keyter",
	"P. retorno BdC Keyter",
	"Tª impulsión BdC Keyter",
	"Tª retorno BdC Keyter",
	"Tª impulsión caldera",
	"Tª exterior",
	"Caudalímetro ammolite"];

//Array con el tipo de unidad de las sondas
var aiUnit = ["--",
	"&degC",
	"&degC",
	"&degC",
	"&degC",
	"&degC",
	"&degC",
	"&degC",
	"%",
	"%",
	"%",
	"%",
	"%",
	"%",
	"&degC",
	"&degC",
	"bar",
	"bar",
	"bar",
	"bar",
	"bar",
	"&degC",
	"&degC",
	"&degC",
	"&degC",
	"m³/s"];


//Array con los valores de configuracion de las entradas digitales
var diConf = ["No usada",
	"ON-OFF remoto",
	"Al. Bomba 1 G1",
	"Al. Bomba 2 G1",
	"Al. Bomba 1 G2",
	"Al. Bomba 2 G2",
	"Al. Bomba 1 G3",
	"Al. Bomba 2 G3",
	"Al. Bomba 1 G4",
	"Al. Bomba 2 G4",
	"Al. Bomba 1 G5",
	"Al. Bomba 2 G5",
	"Al. Bomba ACS",
	"Al. enfriadora Intarcon",
	"Al. enfriadora CIATESA",
	"Al. ammolite",
	"Al. BdC Keyter",
	"Al. caldera 1",
	"Al. caldera 2",
	"Cont. glicol C1",
	"Cont. agua C2",
	"Cont. agua recuperación",
	"Cont. agua ACS",
	"Cont. gasóleo",
	"Cont. glicol C5"
];

//Array con los valores de configuracion de la polaridad de las entradas digitales
var polConf = ["Inverse", "Direct"];

//Array con los valores de configuracion de las salidas digitales
var doConf = ["No usado",
	"Bombas G1",
	"Bombas G2",
	"Bombas G3",
	"Bombas G4",
	"Bombas G5",
	"Bomba ACS",
	"Válvula ACS",
	"ON-OFF enfriadora Intarcon",
	"ON-OFF enfriadora Ciatesa",
	"ON-OFF Ammolite",
	"ON-OFF BdC Keyter",
	"ON-OFF Caldera 1",
	"ON-OFF Caldera 2",
	"Caldera etapa 1",
	"Caldera etapa 2",
	"Resistencia dep. recuperación",
	"V3V recuperación"
];

//Array con los valores de configuracion de las salidas analogicas
var aoConf = ["No usada",
	"V3V Recuperación",
	"Valv. caudal ammolite",
	"Señal quemador modulante",
	"Señal consigna BdC Keyter"
];

//Array con el tipo de unidad de las salidas analogicas
var aoUnit = ["--",
	"%",
	"%",
	"%",
	"%"];

//Array con los valores de configuracion de los tipos de refrigerante
var gasType = ["R22", "R404", "R507", "R134", "R717", "R744", "R410", "R407c", "R407f", "R407a", "R290", "R450A", "R513", "R448a", "R449A", "R32", "R123ZE",
	"R152a", "R452A", "R1234yf"];

//Array con el listado de posibles alarmas activas en el equipo
var activeAlarmsList = ["--", "PB1AL-Pb1 failure", "PB2AL-Pb2 failure", "PB3AL-Pb3 failure", "PB4AL-Pb4 failure", "PB5AL-Pb5 failure", "PB6AL-Pb6 failure", "PB7AL-Pb7 failure", "PB8AL-Pb8 failure", "PB9AL-Pb9 failure", "PB10AL-Pb10 failure",
	"PBE1-Pb1 eDIN4 failure", "PBE2-Pb2 eDIN4 failure", "PBE3-Pb3 eDIN4 failure", "PBE4-Pb4 eDIN4 failure", "PBE5-Pb5 eDIN4 failure", "PBE6-Pb6 eDIN4 failure", "PBE7-Pb7 eDIN4 failure", "PBX1-Pb1 eDIN10 failure",
	"PBX2-Pb2 eDIN10 failure", "PBX3-Pb3 eDIN10 failure", "PBX4-Pb4 eDIN10 failure", "PBX5-Pb5 eDIN10 failure", "PBX6-Pb6 eDIN10 failure", "PBX7-Pb7 eDIN10 failure", "PBX8-Pb8 eDIN10 failure", "PBX9-Pb9 eDIN10 failure", "PBX10-Pb10 eDIN10 failure",
	"CP1C1 - Compressor 1 Circuit 1 alarm", "CP2C1 - Compressor 2 Circuit 1 alarm", "CP3C1 - Compressor 3 Circuit 1 alarm", "CP4C1 - Compressor 4 Circuit 1 alarm", "CP5C1 - Compressor 5 Circuit 1 alarm", "CP6C1 - Compressor 6 Circuit 1 alarm",
	"CP1C2 - Compressor 1 Circuit 2 alarm", "CP2C2 - Compressor 2 Circuit 2 alarm", "CP3C2 - Compressor 3 Circuit 2 alarm", "CP4C2 - Compressor 4 Circuit 2 alarm",
	"CP1C3 - Compressor 1 Circuit 3 alarm", "CP2C3 - Compressor 2 Circuit 3 alarm", "CP3C3 - Compressor 3 Circuit 3 alarm", "CP4C3 - Compressor 4 Circuit 3 alarm",
	"CP1C4 - Compressor 1 Circuit 4 alarm", "CP2C4 - Compressor 2 Circuit 4 alarm", "CP3C4 - Compressor 3 Circuit 4 alarm", "CP4C4 - Compressor 4 Circuit 4 alarm",
	"CP1C5 - Compressor 1 Circuit 5 alarm", "CP2C5 - Compressor 2 Circuit 5 alarm", "CP3C5 - Compressor 3 Circuit 5 alarm", "CP4C5 - Compressor 4 Circuit 5 alarm",
	"LPSC1 - Low pressure switch alarm circuit 1", "LPSC2 - Low pressure switch alarm circuit 2", "LPSC3 - Low pressure switch alarm circuit 3", "LPSC4 -Low pressure switch alarm circuit 4", "LPSC5 -Low pressure switch alarm circuit 5",
	"HPSC1- High pressure switch alarm circuit 1", "HPSC2 - High pressure switch alarm circuit 2", "HPSC3 - High pressure switch alarm circuit 3", "HPSC4 - High pressure switch alarm circuit 4", "HPSC5 - High pressure switch alarm circuit 5",
	"PUM1P - Evaporator pump 1 alarm", "PUM2P - Evaporator pump 2 alarm",
	"FREO01 - Freon antifreeze alarm in circuit 1", "FREO02 - Freon antifreeze alarm in circuit 2", "FREO03 - Freon antifreeze alarm in circuit 3", "FREO04 - Freon antifreeze alarm in circuit 4", "FREO05 - Freon antifreeze alarm in circuit 5",
	"FREE01 - Glicol Antifreeze alarm in circuit 1", "FREE02 - Glicol Antifreeze alarm in circuit 2", "FREE03 - Glicol Antifreeze alarm in circuit 3", "FREE04 - Glicol Antifreeze alarm in circuit 4", "FREE05 - Glicol Antifreeze alarm in circuit 5",
	"FREP01 - Antifreeze alarm by pressure in circuit 1", "FREP02 - Antifreeze alarm by pressure in circuit 2", "FREP03 - Antifreeze alarm by pressure in circuit 3", "FREP04 - Antifreeze alarm by pressure in circuit 4", "FREP05 - Antifreeze alarm by pressure in circuit 5",
	"GENAL - General alarm",
	"FAN1C1 - Fan 1 of circuit 1 alarm", "FAN2C1 - Fan 2 of circuit 1 alarm", "FAN3C1 - Fan 3 of circuit 1 alarm", "FAN4C1 - Fan 4 of circuit 1 alarm",
	"FAN1C2 - Fan 1 of circuit 2 alarm", "FAN2C2 - Fan 2 of circuit 2 alarm", "FAN3C2 - Fan 3 of circuit 2 alarm", "FAN4C2 - Fan 4 of circuit 2 alarm",
	"FAN1C3 - Fan 1 of circuit 3 alarm", "FAN2C3 - Fan 2 of circuit 3 alarm", "FAN3C3 - Fan 3 of circuit 3 alarm", "FAN4C3 - Fan 4 of circuit 3 alarm",
	"FAN1C4 - Fan 1 of circuit 4 alarm", "FAN2C4 - Fan 2 of circuit 4 alarm", "FAN3C4 - Fan 3 of circuit 4 alarm", "FAN4C4 - Fan 4 of circuit 4 alarm",
	"FAN1C5 - Fan 1 of circuit 5 alarm", "FAN2C5 - Fan 2 of circuit 5 alarm", "FAN3C5 - Fan 3 of circuit 5 alarm", "FAN4C5 - Fan 4 of circuit 5 alarm",
	"PUM1S - alarm pump1 secondary", "PUM2S - alarm pump2 secondary",
	"PUMS1 - low suction pressure Pump Primary", "PUMS2 - low suction pressure Pump Secondary",
	"LEAK - alarm gas leakage", "HTEMP - High glicol temperature", "NL4D - Alarm no link DIN4", "NL1D - Alarm no link DIN10", "NLEV - Alarm no link with EVD driver",
	"F1FC - Fan 1 of Free-Cooling", "F2FC - Fan 2 of Free-Cooling", "F3FC - Fan 3 of Free-Cooling", "F4FC - Fan 4 of Free-Cooling", "F5FC - Fan 5 of Free-Cooling", "F6FC - Fan 6 of Free-Cooling",
	"LPSE1 - Electronic low pressure switch cir1", "LPSE2 - Electronic low pressure switch cir2", "LPSE3 - Electronic low pressure switch cir3", "LPSE4 - Electronic low pressure switch cir4", "LPSE5 - Electronic low pressure switch cir5",
	"PBZ1-Pb1 eDIN10' failure", "PBZ2-Pb2 eDIN10' failure", "PBZ3-Pb3 eDIN10' failure", "PBZ4-Pb4 eDIN10' failure", "PBZ5-Pb5 eDIN10' failure", "PBZ6-Pb6 eDIN10' failure", "PBZ7-Pb7 eDIN10' failure", "PBZ8-Pb8 eDIN10' failure", "PBZ9-Pb9 eDIN10' failure", "PBZ10-Pb10 eDIN10' failure",
	"LSH1-Alarm low superheat in Cir1","LSH2-Alarm low superheat in Cir2","LSH3-Alarm low superheat in Cir3","LSH4-Alarm low superheat in Cir4","LSH5-Alarm low superheat in Cir5",
	"ADPS-Air differential pressure switch", "PUM1R-Alarm hot water pump 1", "PUM2R-Alarm hot water pump 2"
];

//Array con el listado de posibles warnings activos en el equipo
var activeWarningsList = ["--",
	"Warning starting attemp PUMP1",
	"Warning starting attemp PUMP2",
	"Warning Low-Pressure Switch active Cir.1",
	"Warning Low-Pressure Switch active Cir.2",
	"Warning Low-Pressure Switch active Cir.3",
	"Warning Low-Pressure Switch active Cir.4",
	"Warning Low-Pressure Switch active Cir.5",
	"Warning High-Pressure Switch active Cir.1",
	"Warning High-Pressure Switch active Cir.2",
	"Warning High-Pressure Switch active Cir.3",
	"Warning High-Pressure Switch active Cir.4",
	"Warning High-Pressure Switch active Cir.5",
	"Warning Low Superheating in Cir.1",
	"Warning Low Superheating in Cir.2",
	"Warning Low Superheating in Cir.3",
	"Warning Low Superheating in Cir.4",
	"Warning Low Superheating in Cir.5",
	"Warning cold fluid-switch problem",
	"Warning low suction pressure in primary pumps",
	"Warning low suction pressure in secondary pumps",
	"Warning gas leakage detector",
	"Warning no communication with EEV Cir.1",
	"Warning no communication with EEV Cir.2",
	"Warning no communication with EEV Cir.3",
	"Warning no communication with EEV Cir.4",
	"Warning no communication with EEV Cir.5",
	"Unit off by pump permission",
	"Warning Electronic Low-Pressure Switch active cir.1",
	"Warning Electronic Low-Pressure Switch active cir.2",
	"Warning Electronic Low-Pressure Switch active cir.3",
	"Warning Electronic Low-Pressure Switch active cir.4",
	"Warning Electronic Low-Pressure Switch active cir.5",
	"Warning Leak detector maintenance",
	"Warning Heat pump 1 start failure",
	"Warning Heat pump 2 start failure",
	"Warning hot fluid-switch problem"
];

//Variables con el valor n+1, siendo n el numero de entradas y salidas analogicas y digitales, para los distintos bucles 
var diNumber = 45;
var aiNumber = 28;
var doNumber = 37;
var aoNumber = 16;
