import React,{useEffect} from 'react'
import './Morals.css';
import { Container, Row, Col } from 'reactstrap';

import Privacy from '../../../Assets/img/privacy.png';
import Security from '../../../Assets/img/security.png';
import Accountability from '../../../Assets/img/accountability.png';

import { useInView } from 'react-intersection-observer';
import {motion, useAnimation} from 'framer-motion';

const Morals = () => {

    const controls = useAnimation();
    const {ref,inView} = useInView();


    useEffect(() => {

        if(inView){
            controls.start('visible');
        }

    }, [controls,inView]);
    
    const fadeLeft ={
        hidden: {opacity:0,x:-180},
        visible: {opacity:1,x:0}
    };

    const fadeIn ={
        hidden: {opacity:0},
        visible: {opacity:1}
    };

    const fadeBottom = {
        hidden: {opacity:0,y:180},
        visible: {opacity:1,y:0}
    };

    const container = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: .3,
            staggerChildren: .5
          }
        }
      };
  
    return (
        <div id= "morals">
            <motion.h4
                ref = {ref}
                initial="hidden"
                animate={controls}
                variants={fadeLeft}
                transition = {{duration:1}}
            >03</motion.h4>
            <motion.h1
                ref = {ref}
                initial="hidden"
                animate={controls}
                variants={fadeLeft}
                transition = {{duration:1}}
            > Company Morals</motion.h1>

            <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            >
            <Container>
                <motion.div
                       ref = {ref}
                       initial="hidden"
                       animate={controls}
                       variants={container}
                >
                <Row>
                    <Col>
                    <motion.div
                    variants={fadeLeft}>
                    <img src={Accountability}/>
                    <h3>Accountability</h3>
                    <p>I like to eat eat eat apples and bannaas I like to ate ate ate apples and bananas</p>
                    </motion.div>
                    </Col>
                    <Col>
                    <motion.div
                    variants={fadeLeft}>
                    <img src={Security}/>
                    <h3>Security</h3>
                    <p>I like to eat eat eat apples and bannas I like to iat iat iat ipples and bininis</p>
                    </motion.div>
                </Col>
                <Col>
                    <motion.div
                    variants={fadeLeft}>
                    <img src={Privacy}/>
                    <h3>Privacy</h3>
                    <p>I like to eat eat eat apples and bannas I like to eat eat eat epples and benenes</p>
                    </motion.div>
                </Col>
                </Row>
                </motion.div>
            </Container>

            </motion.div>


{/*            <motion.div className= "bottom-container"
            
            variants={fadeBottom}
            initial='hidden'
            animate='visible'
            transition = {{duration:1}}
            >
                    <Container className="container1" style = {{ display:"inline-block",width:"300px"}}>
                        <Row>
                        <Col>
                            <h5>Free and Open Source</h5>
                            <p>Safe Accounts has 0 cost and all of the code is available online for review.</p>
                        </Col>
                        </Row>
                    </Container>
            

                    <Container className="container2" style = {{ display:"inline-block",width:"300px"}}>
                        <Row>
                        <Col>
                            <h5>Simplicity on all platforms</h5>
                            <p>Saving and accessing your passwords on all your devices is safe and easy.</p>
                        </Col>
                        </Row>
                    </Container>
              
            </motion.div>*/}


        </div>
    )
}

export default Morals;
