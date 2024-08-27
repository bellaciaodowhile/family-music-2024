import { Chip, Button, CardBody, Card, Tab, Tabs, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem } from "@nextui-org/react";
import { client } from "../supabase/client";
import { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { getData } from "../helpers/getData";
import { capitalizeString } from "../helpers/helpers";
import { voices } from "../helpers/data";


export const Dashboard = () => {

  const [assistantsAdventist, setAssistantsAdventist] = useState([])
  const [assistantsNotAdventist, setAssistantsNotAdventist] = useState([])
  const [instruments, setInstruments] = useState([])
  const [arrVoices, setArrVoices] = useState()
  const [totalParticipants, setTotalParticipants] = useState()

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
          })
        }
      });
    };
    checkAuthStatus();
  }, [navigate]);

  const handleSelectionChange = async (key) => {
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

 

  

  return (
    <>

       <div className="bg-main min-h-screen">
          <div className="px-5 md:px-32 pt-10">
          <Tabs className="bg-none" color="primary" fullWidth>
            <Tab title={`${(assistantsAdventist?.length + assistantsNotAdventist?.length)} - Asistentes`}>
              <Tabs 
                fullWidth 
                color="primary"
              >
                <Tab title={`${assistantsAdventist?.length } - Adventistas`}>
                  <Table color="primary" aria-label="Example static collection table">
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
                  </Table>
                </Tab>
                <Tab title={`${assistantsNotAdventist?.length } - No Adventistas`}>
                  <Table color="primary" aria-label="Example static collection table">
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
                  </Table>
                </Tab>
              </Tabs>
            </Tab>
            <Tab title={`${(totalParticipants)} - Participantes`}>
                <Tabs fullWidth color="primary">
                  <Tab title={`${instruments?.length} - Instrumentos`}>
                    <Table color="primary" aria-label="Example static collection table">
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
                    </Table>
                  </Tab>
                  <Tab title={`${arrVoices?.length} - Voces`}>
                    <div className="flex justify-end">
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
                    </div>

                    <Table color="primary" aria-label="Example static collection table" className="mt-3">
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

                    </Table>
                  </Tab>
                </Tabs>
            </Tab>
          </Tabs>

          </div>
       </div>
        
        
    </>
  )
}