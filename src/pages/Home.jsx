import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Tabs, Tab, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "../hooks/useForm";
import { churchs, voices } from "../helpers/data";
import { useState } from "react";
import { client } from "../supabase/client";
import toast, { Toaster } from 'react-hot-toast';

export const Home = () => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { onInputChange, formState, setFormState } = useForm({})
  const [tabActive, setTabActive] = useState('assistent')
  const [adventist, setAdventist] = useState('adventist')
  const [isLoading, setIsLoading] = useState(false)


  
  const handleAssistent = async (e) => {
    e.preventDefault();

    if (
      !formState.name ||
      !formState.lastname
    ) {
        toast.error('Se requiere completar todos los datos')
        return;
    } 

    if (getAdventist(adventist)) {
      if (!churchs[formState.church]?.label) alert('Seleccione la iglesia')
    }

    try {
      const res = await client.from('personas').insert({
        name: formState.name.trim(),
        lastname: formState.lastname.trim(),
        phone: formState.interested || formState.phone,
        adventist: getAdventist(adventist),
        church: churchs[formState.church]?.label || null,
      })
      console.log(res)
      setIsLoading(true);
      if (res.status == 409) return alert('El correo ya está registrado')
      if (res.status == 201) {
        onClose()
        toast.success('Registro realizado satisfactoriamente')
        setIsLoading(false);
        e.target.reset();
        for (let field of Object.keys(formState)) {
          setFormState({ [field]: '' })
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Ha ocurrido un error al registrarse')
    }

  }
  
  
  
  const handleParticipant = async (e) => {
    e.preventDefault();

    if (
      !formState.name ||
      !formState.lastname ||
      !formState.phone || 
      !churchs[formState.church]?.label
    ) {
        toast.error('Se requiere completar todos los datos')
        return;
    } 

    // if (
    //   !formState.phone.startsWith('0424') ||
    //   !formState.phone.startsWith('0414') ||
    //   !formState.phone.startsWith('0412') ||
    //   !formState.phone.startsWith('0426') ||
    //   !formState.phone.startsWith('0416')
    // ) {
    //   toast.error('Debe registrar el código de la compañia telefónica: 0424, 0414...')
    //   return;
    // }

    if (!formState.voice && !formState.instrument) {
      toast.error('Debe registrar un tipo de ejecución')
      return;
    }

    try {
      const res = await client.from('personas').insert({
        name: formState.name.trim(),
        lastname: formState.lastname.trim(),
        phone: formState.phone,
        adventist: getAdventist(adventist),
        church: churchs[formState.church]?.label || null,
        participant: true,
        voice: formState.voice || null,
        instrument: formState.instrument || null
      })
      setIsLoading(true);
      console.log(res)
      if (res.status == 409) return alert('El correo ya está registrado')
      if (res.status == 201) {
        onClose()
        toast.success('Registro realizado satisfactoriamente')
        setIsLoading(false);
        e.target.reset();
        for (let field of Object.keys(formState)) {
          setFormState({ [field]: '' })
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Ha ocurrido un error al registrarse')
    }

    console.log('Registrando participantes...')
    console.log({
      nombre: formState.name,
      apellido: formState.lastname,
      celular: formState.phone,
      iglesia: churchs[formState.church]?.label,
      voz: formState.voice && voices[formState.voice]?.label || null, 
      instrument: formState.instrument || null
    })
    
  }
  
  const getAdventist = (status) => status == 'adventist' ? true : false; 


  return (
    <>
        <main className="p-0 md:p-10 h-screen flex md:justify-end bg-home">
          <section className="flex flex-col items-center justify-center p-10 rounded-none md:rounded-xl md:max-w-xl w-full bg-notes md:bg-none md:bg-white">
            <img src="/images/logo.webp" alt="Música en Familia 2024" className="max-w-40" />
            <div className="text text-center mt-8">
              <span className="text-xl block text-black">¿Quieres ser parte de la gran experiencia del</span>
              <span className="text-4xl block text-red font-bold my-2">Música en Familia</span>
              <span className="text-7xl block font-extrabold text-black">2024?</span>
            </div>
            <div className="flex gap-5 mt-8">
              <Button onPress={onOpen} radius="full" className='bg-red-500 text-white text-lg p-7' variant="shadow">
                ¡Regístrate!
              </Button>
            </div>
          </section>
        </main>


        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Registro de { tabActive == 'assistent' ? 'asistencia' : 'participante' }</ModalHeader>
              <ModalBody>

                <Tabs aria-label="Register" fullWidth color="primary" radius="full" selectedKey={tabActive} onSelectionChange={setTabActive}>
                  <Tab key="assistent" title="Quiero asistir">
                  <form onSubmit={ handleAssistent }>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input 
                        type="text" 
                        variant="underlined"
                        className="mt-2"
                        label="Nombre"
                        onChange={onInputChange} 
                        name="name" 
                        color="primary" />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input 
                        type="text" 
                        variant="underlined"
                        className="mt-2"
                        label="Apellido"
                        onChange={onInputChange} 
                        name="lastname" 
                        color="primary" />
                    </div>

                    <div className="w-full mt-5">
                      <Tabs aria-label="Options" color="primary" radius="full" fullWidth onSelectionChange={ setAdventist } selectedKey={ adventist }>
                        <Tab key="adventist" title="Adventista">
                          <Select 
                            label="Seleccione la iglesia" 
                            className="w-full mt-2" 
                            variant="underlined"
                            name="church"
                            onChange={onInputChange} >
                            {churchs.map((church, index) => (
                              <SelectItem key={index}>
                                {church.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </Tab>
                        <Tab key="noadventist" title="No Adventista">
                          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                            <Input 
                            type="number" 
                            className="mt-2"
                            variant="underlined"
                            label="¿Desea ser contactado? Opcional"
                            placeholder="04121231234"
                            onChange={onInputChange} 
                            name="interested" 
                            color="primary" />
                        </div>
                        </Tab>
                      </Tabs>
                    </div>
                      
                    <Button color="primary" type="submit" className="w-full mt-4" isLoading={ isLoading }>
                        Registrar
                    </Button>


                  </form>
                  </Tab>
                  <Tab key="participant" title="Quiero participar">
                    <form onSubmit={ handleParticipant }>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                          <Input 
                          type="text" 
                          variant="underlined"
                          className="mt-2"
                          label="Nombre"
                          onChange={onInputChange} 
                          name="name" 
                          color="primary" />
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                          <Input 
                          type="text" 
                          variant="underlined"
                          className="mt-2"
                          label="Apellido"
                          onChange={onInputChange} 
                          name="lastname" 
                          color="primary" />
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                          <Input 
                          type="number" 
                          variant="underlined"
                          className="mt-2"
                          label="Número celular"
                          placeholder="04121231234"
                          onChange={ onInputChange } 
                          name="phone" 
                          color="primary" />
                      </div>

                      <Select 
                        label="Seleccione la iglesia" 
                        className="w-full mt-2" 
                        variant="underlined"
                        onChange={ onInputChange }
                        name="church">
                        {churchs.map((church, index) => (
                          <SelectItem key={index}>
                            {church.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <div className="w-full mt-5">
                        <Tabs aria-label="Options" color="primary" radius="full" fullWidth>
                          <Tab key="Voz" title="Voz">
                            <Select 
                              label="Seleccione registro vocal" 
                              className="w-full mt-2" 
                              variant="underlined"
                              onChange={ onInputChange }
                              name="voice">
                              {voices.map((voice, index) => (
                                <SelectItem key={index}>
                                  {voice.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </Tab>
                          <Tab key="Instrumento" title="Instrumento">
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                              <Input 
                              type="text" 
                              className="mt-2"
                              variant="underlined"
                              label="¿Qué instrumento ejecutarás?"
                              onChange={onInputChange} 
                              name="instrument" 
                              color="primary" />
                          </div>
                          </Tab>
                        </Tabs>
                      </div>


                      <Button color="primary" type="submit" className="w-full mt-4" isLoading={ isLoading }>
                        Registrar
                      </Button>

                    </form>
                  </Tab>
                </Tabs>

                
                
              </ModalBody>
              <ModalFooter className="flex flex-col">
               
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
