import React from 'react'
import MainDash from '../Admin/MainDash'
import useDocumentTitle from '../../utils/UseDocumentTitle'

const StaffDashboard = () => {
  useDocumentTitle('Dashboard')
  return (
    <div>
      <MainDash />
    </div>
  )
}

export default StaffDashboard