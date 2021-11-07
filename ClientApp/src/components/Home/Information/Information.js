import React from 'react'
import hacker from '../../../Assets/img/hacker.png';
import { motion, useAnimation } from "framer-motion";
import './Information.css';
import { InView } from 'react-intersection-observer';

const Information = () => {


   const controls = useAnimation();
      
    const fadeTop ={
        hidden: {opacity:0,y:-180},
        visible: {opacity:1,y:0}
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
        <InView as="div" threshold={.5}
            onChange={(inView, entry) => {
                if (inView) {
                    controls.start('visible');
                }
            }}>

            <div id ="why">
                <motion.h4
                    initial="hidden"
                    animate={controls}
                    variants={fadeTop}
                    transition = {{duration:1}}
                    >02
                </motion.h4>

                <motion.h1
                    initial="hidden"
                    animate={controls}
                    variants={fadeTop}
                    transition = {{duration:1}}
                    >Why use Safe Accounts?
                </motion.h1>

                <motion.div className="why-wrapper" initial="hidden" animate={controls} variants={container}>

                    <motion.div className="box1" variants={fadeBottom}>

                        <h5 className="heading">Prevent Thief ♘</h5>
           
                        <p>
                            Over the past decades, cyber attacks have stolen over a million of 
                            people's password and data. Due to the COVID-19 outbreak an uptick in sophisticated phishing email schemes 
                            by cybercriminals has emerged.

                        </p>
                        <hr/>
                    </motion.div>
            
                    <motion.div className="box2" variants={fadeBottom}>
                        <h5 className="heading">Easy Use ♗</h5>

                        <p>
                        Password managers allow users to come up with as many complicated passwords as they want and 
                        lock them all behind one master password. People will never have to worry about there data being stolen with Safe Accounts.
                        </p>
                    </motion.div>
            
                    <motion.div className="box3" variants={fadeBottom}>
                        <h5 className="heading">Centeralized Access ♔</h5>

                        <p>
                        Access you passwords from one place. With an encrypted master key that you only have 
                        Safe Accounts is the centeral to keep one's password. If you only keep your passwords
                        with us it will be easy to access your passwords.
                        </p>
                        <hr/>
                    </motion.div>
            
                    <motion.div className="box4" variants={fadeBottom}>
                        <h5 className="heading">No Need to Memorize ♖</h5>

                        <p>
                        Create the longest and abstract passwords you can think of for every single application/company you sign up for. The 
                        purpose of a password manager is to keep your passwords safe and also so you don't have to remember it.
                        </p>
                    </motion.div>
                    
                    <motion.div className="box5" variants={fadeTop}>
                        <img id="hacker" src = {hacker}/>
                    </motion.div>
                </motion.div>
            </div>
        </InView>
    )
}

export default Information;
