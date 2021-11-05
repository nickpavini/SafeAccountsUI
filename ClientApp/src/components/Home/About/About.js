import React, {useState,useEffect} from 'react'
import './About.css';
import safe from '../../../Assets/img/safe.png';

import fb from '../../../Assets/img/FB.png';
import YT from '../../../Assets/img/YT.png';
import IN from '../../../Assets/img/IN.png';
import AM from '../../../Assets/img/AM.png';
import SC from '../../../Assets/img/SC.png';
import twitter from '../../../Assets/img/twitter.png';
import reddit from '../../../Assets/img/reddit.png';
import discord from '../../../Assets/img/discord.png';
import WA from '../../../Assets/img/WA.png';

import { motion, useAnimation } from "framer-motion";

import { InView } from 'react-intersection-observer';


const About = () => {

    const controls = useAnimation();

    const fadeLeft ={
      hidden: {opacity:0,x:-180},
      visible: {opacity:1,x:0}
  };

    const fadeTop ={
      hidden: {opacity:0,y:-180},
      visible: {opacity:1,y:0}
  };

  const fadeIn ={
    hidden: {opacity:0, scale: 0},
    visible: {opacity:1,scale: 1}
  };

    const container = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration:1,
            delayChildren: .8,
            staggerChildren: .3
          }
        }
      };
      
      const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        },
      };

    return (
        <>
            <section id="about">
            <InView as="div" threshold={.4} onChange={(inView, entry) =>{

                if (inView) {
                    controls.start('visible');
                }

            }

            }>
               
           
        
        <motion.h4
            initial="hidden"
            animate={controls}
            variants={fadeTop}
            transition = {{duration:1}}
            >01</motion.h4>
        <motion.h1
            initial="hidden"
            animate={controls}
            variants={fadeTop}
            transition = {{duration:1}}
        >What is a Password Manager?</motion.h1>

        <motion.hr
            initial="hidden"
            animate={controls}
          variants={fadeIn}
          transition = {{duration:2}}
        />
        <br/>
        <br />

        <div className="safe-containter">
                        <div className="layer1" >
            <motion.img 

                initial="hidden"
                animate={controls}
            variants={fadeIn}

            transition = {{duration:1}}
            src={safe} id="safe"/>
                        </div>

            <div className= "layer2">
            <motion.ul
            
                initial="hidden"
                animate={controls}
                        className="con"
                        variants={container}

                    >
                         <motion.img  src={fb}  variants={item} />
                         <motion.img  src={YT} variants={item} />
                         <motion.img  src={WA} variants={item} />
                         <motion.img  src={SC}  variants={item} />
                         <motion.img  class="no-icons"src={AM} variants={item} />
                         <motion.img  class="no-icons" src={reddit} variants={item} />
                         <motion.img  class="no-icons" src={twitter} variants={item} />
                         <motion.img  class="no-icons" src={IN} variants={item} />
                         <motion.img  class="no-icons" src={discord}  variants={item} />
                         <motion.img  class="no-icons" src={SC}  variants={item} />
            </motion.ul>
            </div>


        </div>
       <motion.p
            initial="hidden"
            animate={controls}
       variants={fadeLeft}

       transition = {{duration:1}}
       >
       A password manager is a software application that is used to store and manage
       the passwords that a user has for various online accounts and security features. Password 
       managers store the passwords in an encrypted format and provide secure access to all the password 
       information with the help of a master password.
       </motion.p>
       <motion.div 
            initial="hidden"
            animate={controls}
         variants={fadeLeft}
         transition = {{duration:2}}
         className ="points"
       style= {{background:"#add8e6",paddingBottom:"10px", display:"inline-block"}}>
       <li>Don’t lose access to accounts that matter just because you forgot a password </li>
       <li>When creating new accounts, save your details in a click. </li>
       <li>Store your credit card details and shipping information for a smoother checkout.</li>
        </motion.div>



                </InView>
            </section>
        </>
    )
}

export default About;