'use client';
import React from 'react';
import Header from '@/components/Header';
import Clientsreview from '@/components/Clientsreview';
import Category from '@/components/Category';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonal from '@/components/Testimonal'
import DialogflowChatbot from '@/components/DialogFlowChatbot';
import Recommendations from '@/components/Recommendations';


const HomePage = () => {
  return (
    <div className="bg-gray-800">
      {/* Header Section */}
      <Header />

      

      {/* Shop By Category Section */}
      <Category />

      
      <FeaturedProducts/>
      <Testimonal/>
      <div className='bg-white'><Recommendations/></div>
      <Clientsreview/>
      
      <DialogflowChatbot/>


      
      
    </div>
  );
};

export default HomePage;
