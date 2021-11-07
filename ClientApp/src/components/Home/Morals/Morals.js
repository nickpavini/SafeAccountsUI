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
            >Company Morals</motion.h1>

            <motion.hr
                initial="hidden"
                animate={controls}
                variants={fadeIn}
                transition={{ duration: 2 }}
            />
            <br/>

            <motion.div initial="hidden" animate={controls} variants={fadeIn}>
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
                                <img alt="" src={Accountability}/>
                                <h3>Free & Open Soruce!</h3>
                                <p>Safe Accounts has 0 cost and all the code is available online for peer review.</p>
                                </motion.div>
                            </Col>
                            <Col>
                                <motion.div
                                variants={fadeLeft}>
                                <img alt="" src={Security}/>
                                <h3>Security</h3>
                                <p>Our goal is assist in making everyone's online presence more secure and allow you to feel safe.</p>
                                </motion.div>
                            </Col>
                            <Col>
                                <motion.div
                                variants={fadeLeft}>
                                <img alt="" src={Privacy}/>
                                <h3>Privacy</h3>
                                <p>We believe in your right to privacy. Safe accounts will never sell your email and does not track your online activity.</p>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>
                </Container>
            </motion.div>
        </div>
    )
}

export default Morals;
