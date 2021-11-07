import React from 'react'
import './Starter.css';
import { Container, Row, Col } from 'reactstrap';
import starter from '../../../Assets/img/start.png'
import { motion } from 'framer-motion';

const Starter = () => {

    const fadeLeft ={
        hidden: {opacity:0,x:-180},
        visible: {opacity:1,x:0}
    };

    const fadeRight ={
        hidden: {opacity:0,x:180},
        visible: {opacity:1,x:0}
    };


    return (

        <div id = 'starter'>
        <Container id ="full" fluid={true}>
            <Row>
                <Col id ="desktop-starter" >
                    <motion.img 
                        variants={fadeLeft}
                        initial='hidden'
                        animate='visible'
                        transition = {{duration:1}}
                    src = {starter}/>
                    </Col>
                <Col>
                    <motion.h1
                        variants={fadeRight}
                        initial='hidden'
                        animate='visible'
                        transition = {{duration:1}}
                    >Never worry about your passwords again.</motion.h1>
                    <motion.p
                        variants={fadeRight}
                        initial='hidden'
                        animate='visible'
                        transition = {{duration:1}}       
                    >From passwords to personal info, Safe Accounts is the simple solution for protecting all your data. Get started with your trial today.</motion.p>
                    <span id ="wrapper"> 
  
                         
{/*                    <motion.button
                             
                        variants={fadeBottom}
                        initial='hidden'
                        animate='visible'
                        transition = {{duration:1}}  
                        className="button">
                                Explore
                        <div className="button__horizontal"></div>
                        <div className="button__vertical"></div>
                    </motion.button>*/}

                    </span>
                </Col>
            </Row>
        </Container>

         


        </div>
    )
}

export default Starter;
