import { Chip, Button, CardBody, Card, CardHeader, Tab, Tabs, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Input, DatePicker, Accordion, AccordionItem, Switch, VisuallyHidden, useSwitch, select } from "@nextui-org/react";
import { client } from "../supabase/client";
import { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { getData } from "../helpers/getData";
import { capitalizeString, dateFormatt } from "../helpers/helpers";
import { voices } from "../helpers/data";
import toast, { Toaster } from 'react-hot-toast';


export const Dashboard = () => {

  const [assistantsAdventist, setAssistantsAdventist] = useState([])
  const [assistantsNotAdventist, setAssistantsNotAdventist] = useState([])
  const [instruments, setInstruments] = useState([])
  const [ensayos, setEnsayos] = useState([])
  const [arrVoices, setArrVoices] = useState()
  const [totalParticipants, setTotalParticipants] = useState()
  const [countVoices, setCountVoices] = useState([])
  const [buttonActive, setButtonActive] = useState('all')
  const [dateEnsayo, setDateEnsayo] = useState()
  const [selectEnsayo, setSelectEnsayo] = useState()

  const [isSelected, setIsSelected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      client.auth.onAuthStateChange(async (event, session) => {
        if (!session) {
          navigate('/login');
        } else {
          navigate('/dashboard');
          getData({ participant: false, adventist: false })
          .then(data => {
            setAssistantsNotAdventist(data)
          })
          getData({ participant: false, adventist: true })
          .then(data => {
            setAssistantsAdventist(data)
          })
          getData({ participant: true })
          .then(data => {
            setInstruments(data.filter(item => !item.voice))
          })
          getData({ participant: true })
          .then(data => {
            setArrVoices(data.filter(item => !item.instrument))
            setTotalParticipants(data.length)
            const newData = data.filter(item => !item.instrument)
            setCountVoices([
              newData.length,
              newData.filter(x => x.voice == '0').length,
              newData.filter(x => x.voice == '1').length,
              newData.filter(x => x.voice == '2').length,
              newData.filter(x => x.voice == '3').length,
              newData.filter(x => x.voice == '4').length
            ])
          })
          getData({}, 'ensayos')
          .then(data => {
            setEnsayos(data)
          })  
        }
      });
    };
    checkAuthStatus();
  }, [navigate]);

  const getEnsayos = () => {
    getData({}, 'ensayos')
    .then(data => {
      setEnsayos(data)
    })  
  }


  // console.log(voices)



  // console.log(voiceCounts)

// const lengthData = (key) => {
//   // console.log(key)
//   // return key;
//   getData({ participant: true })
//   .then(data => {
//     const newData = data.filter(item => !item.instrument)
//     if (key == 'all') {
//       return newData.length
//       // console.log(newData.length)
//     } else {
//       return newData.filter(item => item.voice == key).length
//     }
//   })
// }




  const handleSelectionChange = async (key) => {
    setButtonActive(key)
    if (key == 'all') {
      getData({ participant: true })
      .then(data => {
        setArrVoices(data.filter(item => !item.instrument))
      })
    } else {
      getData({ participant: true })
      .then(data => {
        const newData = data.filter(item => !item.instrument)
        setArrVoices(newData.filter(item => item.voice == key))
      })
    }
  }

  const copyClipboard = (number) => {
    console.log(`Copiando número: ${ number }`)
    navigator.clipboard.writeText(number)
    .then(() => {
      toast.success(`Número copiado: ${number}`)
    }), function(err) {
      console.error(`Error al copiar: ${ err }`)
    }
  }


  // Buscador en tiempo real
  const [searchTerm, setSearchTerm] = useState('');

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVoices = arrVoices?.filter(item => {
    const fullName = `${item.name} ${item.lastname}`.toLowerCase();
    const church = item.church.toLowerCase();
    const voiceLabel = voices[item.voice]?.label.toLowerCase(); // Asegúrate de que voices[item.voice] exista
  
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      church.includes(searchTerm.toLowerCase()) ||
      (voiceLabel && voiceLabel.includes(searchTerm.toLowerCase()))
    );
  });


  const handleInputEnsayo = (e) => {
    const date = new Date(e.year, e.month - 1, e.day); // Recuerda que los meses en JavaScript son indexados desde 0
  
    // Extraer día, mes y año
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    const year = String(date.getFullYear()).slice(-2); // Obtiene los dos últimos dígitos del año
  
    // Formato dd/mm/YY
    const formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate); // Muestra la fecha formateada
    setDateEnsayo(formattedDate); // Aquí puedes guardar la fecha formateada en tu estado
  }

  const handleEnsayo = async (e) => {
    console.log(dateEnsayo)
    console.log(e)

    if (!dateEnsayo) return toast.error('Debe colocar la fecha para registrar el ensayo')

    try {
      const res = await client.from('ensayos').insert({
        date: dateEnsayo.trim(),
      })
      console.log(res)
      if (res.status == 409) return toast.error('Esta fecha ya está registrada')
      if (res.status == 201) {
        toast.success('Registro realizado satisfactoriamente')
        setDateEnsayo('')
        getEnsayos();
      }
    } catch (error) {
      console.log(error)
      toast.error('Ha ocurrido un error al registrar el ensayo')
    }
  }

  const handleAsistente = async (person) => {
    console.log('Asistente: ' + person)
    if (!selectEnsayo) return toast.error('Debe seleccionar un ensayo')
    console.log(selectEnsayo)

    const idEnsayo = ensayos[selectEnsayo.currentKey]?.id
    const currentEnsayo = ensayos[selectEnsayo.currentKey]?.date
    console.log(person)

    const getAsistentes = ensayos[selectEnsayo.currentKey]?.asistentes
    const getInasistentes = ensayos[selectEnsayo.currentKey]?.inasistentes
    const arrAsistentes = getAsistentes?.split(',');
    const arrInasistentes = getInasistentes?.split(',');

    const currentInasistentes = arrInasistentes.filter(x => x != person).join(',')
    const currentAsistentes = arrAsistentes.filter(x => x != person).join(',')

    if (arrAsistentes?.includes(person.toString())) return toast.error(`Ya esta persona está asistente en el ensayo de ${currentEnsayo}`)
    if (arrInasistentes?.includes(person.toString())) {
      if (confirm('¿Está seguro que desea que cambiar de inasistente a asistente este registro?')) {
        // Actualizando asistentes e inasistentes
        const { data, error } = await client
        .from('ensayos')
        .update(
          { asistentes: `${currentAsistentes}${person},` }
        )
        .match({ id: idEnsayo })

        const { x, y } = await client
        .from('ensayos')
        .update(
          { inasistentes: currentInasistentes },
        )
        .match({ id: idEnsayo })
        getEnsayos()

        if (!x) toast.success('Operación exitosa!')
      }
      return
    }



    if (!ensayos[selectEnsayo.currentKey]?.asistentes) {
      const { data, error } = await client
      .from('ensayos')
      .update({ asistentes: `${person},` })
      .match({ id: idEnsayo })
      getEnsayos()

      console.log(data)
      if (!data) toast.success('Operación exitosa!')
    } else {
      const { data, error } = await client
      .from('ensayos')
      .update({ asistentes: `${getAsistentes}${person},` })
      .match({ id: idEnsayo })
      getEnsayos()

      console.log(data)
      if (!data) toast.success('Operación exitosa!')
    }
  }

  const handleInasistente = async (person) => {
    console.log('Inasistente: ' + person)
    if (!selectEnsayo) return toast.error('Debe seleccionar un ensayo')
    console.log(selectEnsayo)

    const idEnsayo = ensayos[selectEnsayo.currentKey]?.id
    const currentEnsayo = ensayos[selectEnsayo.currentKey]?.date
    console.log(person)

    const getAsistentes = ensayos[selectEnsayo.currentKey]?.asistentes
    const getInasistentes = ensayos[selectEnsayo.currentKey]?.inasistentes
    const arrAsistentes = getAsistentes?.split(',');
    const arrInasistentes = getInasistentes?.split(',');

    const currentInasistentes = arrInasistentes.filter(x => x != person).join(',')
    const currentAsistentes = arrAsistentes.filter(x => x != person).join(',')    

    if (arrInasistentes?.includes(person.toString())) return toast.error(`Ya esta persona está inasistente en el ensayo de ${currentEnsayo}`)
    if (arrAsistentes?.includes(person.toString())) {
      if (confirm('¿Está seguro que desea que cambiar de asistente a inasistente este registro?')) {
        const { data, error } = await client
        .from('ensayos')
        .update(
          { asistentes: `${currentAsistentes}` }
        )
        .match({ id: idEnsayo })

        const { x, y } = await client
        .from('ensayos')
        .update(
          { inasistentes: `${currentInasistentes}${person},` },
        )
        .match({ id: idEnsayo })
        getEnsayos()

        if (!x) toast.success('Operación exitosa!')

        console.log(currentAsistentes)
        console.log(`${currentInasistentes}${person},`)

      }
      return
    }



    if (!ensayos[selectEnsayo.currentKey]?.inasistentes) {
      const { data, error } = await client
      .from('ensayos')
      .update({ inasistentes: `${person},` })
      .match({ id: idEnsayo })
      getEnsayos()
      
      console.log(data)
      if (!data) toast.success('Operación exitosa!')
    } else {
      const { data, error } = await client
      .from('ensayos')
      .update({ inasistentes: `${getInasistentes}${person},` })
      .match({ id: idEnsayo })
      getEnsayos()

      console.log(data)
      if (!data) toast.success('Operación exitosa!')
    }
  }

  const getPeople = (idEnsayo) => {
    const asistentes = ensayos[idEnsayo]?.asistentes
    // if (asistentes) {
    //   // console.log(asistentes)
    //   const arrAsistentes = asistentes.split(',');

    //   const asistentesFiltrados = arrAsistentes.flatMap(x => 
    //     voices?.filter(person => person.id == x) || [] // Filtramos y aseguramos que no sea undefined
    //   );
    //   console.log(asistentesFiltrados)
    //   return asistentesFiltrados
    // }
  }


  


  return (
    <>
       <div className="bg-main min-h-screen">
          <div className="px-5 md:px-32 pt-10">
          <Link 
          to={ '/' }
          className="text-white ">
            { '< Volver al inicio' }
          </Link>


          <Tabs fullWidth color="primary" className="mt-10">
            <Tab title="Registros">
              <Tabs className="bg-none" color="primary" fullWidth>
                <Tab title={`${(assistantsAdventist?.length + assistantsNotAdventist?.length)} - Asistentes`}>
                  <Tabs 
                    fullWidth 
                    color="primary"
                  >
                    <Tab title={`${assistantsAdventist?.length } - Adventistas`}>
                      {
                        assistantsAdventist?.length > 0 ?
                          assistantsAdventist.map((item, index) => {
                            return (
                              <Card className="py-4 mt-5" key={index}>
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                  <p className="text-tiny uppercase font-bold">Iglesia</p>
                                  <small className="text-default-500">{ item.church }</small>
                                  <h4 className="font-bold text-large">{ capitalizeString(item.name) } { capitalizeString(item.lastname)}</h4>
                                </CardHeader>
                              </Card>
                            )
                          })
                        : 'No hay registros en esta sección'
                      }

                      {/* <Table color="primary" aria-label="Example static collection table">
                        <TableHeader>
                          <TableColumn>Nombre y Apellido</TableColumn>
                          <TableColumn>Iglesia</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No existen registros en esta sección">
                          {
                            assistantsAdventist.map((item, index) => {
                              return (
                                <TableRow key={ index }>
                                  <TableCell>{ capitalizeString(item.name) } { capitalizeString(item.lastname) }</TableCell>
                                  <TableCell>{ item.church }</TableCell>
                                </TableRow>
                              )
                            })
                          }
                        </TableBody>
                      </Table> */}

                          


                    

                      {/* <Card className="py-4">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                          <p className="text-tiny uppercase font-bold">Daily Mix</p>
                          <small className="text-default-500">12 Tracks</small>
                          <h4 className="font-bold text-large">Frontend Radio</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                        
                        </CardBody>
                      </Card> */}
                    


                    </Tab>
                    <Tab title={`${assistantsNotAdventist?.length } - No Adventistas`}>
                      {/* <Table color="primary" aria-label="Example static collection table">
                        <TableHeader>
                          <TableColumn>Nombre y Apellido</TableColumn>
                          <TableColumn>Interesado</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No existen registros en esta sección">
                          {
                            assistantsNotAdventist.map((item, index) => {
                              return (
                                <TableRow key={ index }>
                                  <TableCell>{ item.name } { item.lastname }</TableCell>
                                  <TableCell>{ !item.phone ? 'No' : item.phone}</TableCell>
                                </TableRow>
                              )
                            })
                          }
                        </TableBody>
                      </Table> */}
                      {
                        assistantsAdventist?.length > 0 ?
                          assistantsNotAdventist.map((item, index) => {
                            return (
                              <Card className="py-4 mt-5" key={index}>
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                  <p className="text-tiny uppercase font-bold">Interesado</p>
                                  <small className="text-default-500">{ !item.phone ? 'No' : item.phone}</small>
                                  <h4 className="font-bold text-large">{ capitalizeString(item.name) } { capitalizeString(item.lastname)}</h4>
                                </CardHeader>
                              </Card>
                            )
                          })
                        : 'No hay registros en esta sección'
                      }
                    </Tab>
                  </Tabs>
                </Tab>
                <Tab title={`${(totalParticipants)} - Participantes`}>

                  <Switch 
                  className="mt-1"
                  isSelected={isSelected}
                  onValueChange={setIsSelected}>
                    Modo asistencia
                  </Switch>

                  


                    <Tabs fullWidth color="primary" className="mt-3">
                      <Tab title={`${instruments?.length} - Instrumentos`}>
                        {/* <Table color="primary" aria-label="Example static collection table">
                          <TableHeader>
                            <TableColumn>Nombre(s) y Apellido(s)</TableColumn>
                            <TableColumn>N° Celular</TableColumn>
                            <TableColumn>Iglesia</TableColumn>
                            <TableColumn>Instrumento</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent="No existen registros en esta sección">
                            {
                            instruments && (
                              instruments.map((item, index) => {
                                return (
                                  <TableRow key={ index }>
                                    <TableCell>{ capitalizeString(item.name) } { capitalizeString(item.lastname) }</TableCell>
                                    <TableCell>
                                      <Dropdown placement="bottom-start" className="dark text-white">
                                        <DropdownTrigger>
                                          <Button variant="bordered">{ item.phone }</Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Static Actions">
                                          <DropdownItem key="12">Copiar número</DropdownItem>
                                          <DropdownItem href={`https://wa.me/+58${ item.phone }`} target="_blank" key="123">WhatsApp</DropdownItem>
                                          <DropdownItem href={`tel:+58${ item.phone }`} target="_blank" key="24">Llamar</DropdownItem>
                                          <DropdownItem href={`sms:+58${ item.phone }`} target="_blank" key="34">Mensaje de texto</DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                    </TableCell>
                                    <TableCell>{ item.church }</TableCell>
                                    <TableCell>{ item.instrument }</TableCell>
                                  </TableRow>
                                )
                              })
                            )
                            }
                          
                          </TableBody>
                        </Table> */}



                        {
                          instruments?.length > 0 ?
                            instruments.map((item, index) => {
                              return (
                                <Card className="py-4 mt-5" key={index}>
                                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                  <h4 className="font-bold text-large">{ capitalizeString(item.name) }&nbsp;{ capitalizeString(item.lastname)}</h4>
                                    <div className="flex gap-5 mt-3">
                                      <div>
                                        <p className="text-tiny uppercase font-bold">iglesia</p>
                                        <small className="text-default-500">{ item.church }</small>
                                      </div>
                                      <div>
                                        <p className="text-tiny uppercase font-bold">instrumento</p>
                                        <small className="text-default-500">{ item.instrument }</small>
                                      </div>
                                    </div>
                                    <Dropdown placement="bottom-start" className="dark text-white">
                                      <DropdownTrigger>
                                        <Button variant="bordered" className="mt-3">{ item.phone }</Button>
                                      </DropdownTrigger>
                                      <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem key="12" onClick={() => copyClipboard(item.phone)}>Copiar número</DropdownItem>
                                        <DropdownItem href={`https://wa.me/+58${ item.phone }`} target="_blank" key="123">WhatsApp</DropdownItem>
                                        <DropdownItem href={`tel:+58${ item.phone }`} target="_blank" key="24">Llamar</DropdownItem>
                                        <DropdownItem href={`sms:+58${ item.phone }`} target="_blank" key="34">Mensaje de texto</DropdownItem>
                                      </DropdownMenu>
                                    </Dropdown>
                                  </CardHeader>
                                </Card>
                              )
                            })
                          : 'No hay registros en esta sección'
                        }





                      </Tab>
                      <Tab title={`${arrVoices?.length} - Voces`}>


                        <Input 
                          type="text" 
                          label="Buscar" 
                          value={searchTerm}
                          onChange={handleSearchChange} 
                          className="mt-2"
                          size="sm"
                        />




                        <div className="flex gap-3 flex-wrap mt-5">
                          {[{ label: 'Todas' }, ...voices].map((voice, index) => (
                            <Button key={!index ? 'all' : (index - 1)} variant="bordered" className={[`grow`, 'border-3', buttonActive == (!index ? 'all' : (index - 1)) ? 'border-blue-500' : 'border' ]} onClick={() => handleSelectionChange(!index ? 'all' : (index - 1))}>
                              { voice.label } <span className="rounded-full text-xs p-1 font-bold">
                                { countVoices[index] }
                              </span>
                            </Button>
                            // <DropdownItem key={!index ? 'all' : (index - 1)}>{ voice.label }</DropdownItem>
                          ))}
                        </div>

                        <Select
                          label="Seleccione la fecha de ensayo"
                          variant="bordered"
                          placeholder="00/00/0000"
                          selectedKeys={selectEnsayo}
                          className={`mt-4 ${isSelected ? 'block' : 'hidden'}`}
                          onSelectionChange={setSelectEnsayo}
                        >
                          {
                            ensayos?.map((item, index) => (
                              <SelectItem key={index}>{ item.date }</SelectItem>
                            ))
                          }
                        </Select>

                        {/* <div className="flex justify-end">
                          <Dropdown placement="bottom-end" className="dark text-white">
                            <DropdownTrigger>
                              <Button variant="bordered">Seleccione la voz:</Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Voices" onAction={(key) => handleSelectionChange(key)}>
                              {[{ label: 'Todas' }, ...voices].map((voice, index) => (
                                  <DropdownItem key={!index ? 'all' : (index - 1)}>{ voice.label }</DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </div> */}

                        {/* <Table color="primary" aria-label="Example static collection table" className="mt-3">
                          <TableHeader>
                            <TableColumn>Nombre(s) y Apellido(s)</TableColumn>
                            <TableColumn>N° Celular</TableColumn>
                            <TableColumn>Iglesia</TableColumn>
                            <TableColumn>Voz</TableColumn>
                          </TableHeader>
                          <TableBody items={arrVoices} emptyContent={'No existen datos registrados en esta sección'}>
                            {(item) => (
                              <TableRow key={item.key}>
                                <TableCell>{ item.name } { item.lastname }</TableCell>
                                <TableCell>
                                  <Dropdown placement="bottom-start" className="dark text-white">
                                    <DropdownTrigger>
                                      <Button variant="bordered">{ item.phone }</Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                      <DropdownItem key="copy_number">Copiar número</DropdownItem>
                                      <DropdownItem href={`https://wa.me/+58${ item.phone }`} target="_blank" key="whatsapp">WhatsApp</DropdownItem>
                                      <DropdownItem href={`tel:+58${ item.phone }`} target="_blank" key="call">Llamar</DropdownItem>
                                      <DropdownItem href={`sms:+58${ item.phone }`} target="_blank" key="msg_text">Mensaje de texto</DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                </TableCell>
                                <TableCell>{ item.church }</TableCell>
                                <TableCell>{ voices[item.voice].label }</TableCell>
                              </TableRow>
                            )}
                          </TableBody> 
                        </Table> */}

                        {
                          filteredVoices?.length > 0 ?
                            filteredVoices.map((item, index) => {
                              return (
                                <Card className="py-4 mt-5" key={index}>
                                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                  <h4 className="font-bold text-large">{ capitalizeString(item.name) }&nbsp;{ capitalizeString(item.lastname)}</h4>
                                    <div className="flex gap-5 mt-3">
                                      <div>
                                        <p className="text-tiny uppercase font-bold">iglesia</p>
                                        <small className="text-default-500">{ item.church }</small>
                                      </div>
                                      <div>
                                        <p className="text-tiny uppercase font-bold">voz</p>
                                        <small className="text-default-500">{ voices[item.voice].label }</small>
                                      </div>
                                    </div>
                                    <Dropdown placement="bottom-start" className="dark text-white">
                                      <DropdownTrigger>
                                        <Button variant="bordered" className="mt-3">{ item.phone }</Button>
                                      </DropdownTrigger>
                                      <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem key="12" onClick={() => copyClipboard(item.phone)}>Copiar número</DropdownItem>
                                        <DropdownItem href={`https://wa.me/+58${ item.phone }`} target="_blank" key="123">WhatsApp</DropdownItem>
                                        <DropdownItem href={`tel:+58${ item.phone }`} target="_blank" key="24">Llamar</DropdownItem>
                                        <DropdownItem href={`sms:+58${ item.phone }`} target="_blank" key="34">Mensaje de texto</DropdownItem>
                                      </DropdownMenu>
                                    </Dropdown>
                                    <div className={`${isSelected ? 'flex' : 'hidden'} gap-4 mt-4 w-full`}>
                                      <Button 
                                      className="grow" 
                                      color="success"
                                      onClick={() => handleAsistente(item.id)}
                                      >
                                        Asistente
                                      </Button>
                                      <Button 
                                      className="grow" 
                                      color="danger"
                                      onClick={() => handleInasistente(item.id)}
                                      >
                                        Inasistente
                                      </Button>
                                    </div>
                                    <div className={`${!isSelected ? 'flex' : 'hidden'} gap-4 mt-4 w-full`}>
                                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-xl"></div>
                                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-xl"></div>
                                    </div>
                                  </CardHeader>
                                </Card>
                              )
                            })
                          : 'No hay registros en esta sección'
                        }


                      </Tab>
                    </Tabs>
                </Tab>
              </Tabs>
            </Tab>
            <Tab title="Ensayos">
              <div className="text-md mt-10">Registrar fecha de ensayo</div>
              <div className="flex gap-3 items-center mt-2">
                <DatePicker 
                label="Fecha" 
                className="w-full" 
                size="sm"
                onChange={handleInputEnsayo}/>
                <Button color="primary" onClick={handleEnsayo}>
                  Guardar
                </Button>
              </div>
              <Accordion variant="shadow" className="mt-5">
                {ensayos?.map((ensayo, index) => (
                  <AccordionItem key={ index } aria-label={ dateFormatt(ensayo.date) } title={ dateFormatt(ensayo.date) }>



                   {
                    getPeople(ensayo.id)?.map(item =>{
                      {item}
                    })
                   }


                  </AccordionItem>
                ))}
              </Accordion>
            </Tab>
          </Tabs>


         

          </div>
       </div>
        
        
    </>
  )
}