// import React from 'react';
// import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';

// const AvailabilityCalendar = ({ availabilities, onEventAdded }) => {
//   const onPopupOpen = args => {
//     if (args.type === 'Editor') {
//       args.cancel = true;
//       const data = args.data;
//       if (!data.Id) {
//         onEventAdded({
//           Id: Date.now(),
//           StartTime: data.StartTime,
//           EndTime: data.EndTime,
//           Subject: 'Available'
//         });
//       }
//     }
//   };

//   return (
//     <ScheduleComponent height="650px" selectedDate={new Date()} eventSettings={{ dataSource: availabilities }} popupOpen={onPopupOpen}>
//       <ViewsDirective>
//         <ViewDirective option='Day'/>
//         <ViewDirective option='Week'/>
//         <ViewDirective option='WorkWeek'/>
//         <ViewDirective option='Month'/>
//       </ViewsDirective>
//       <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
//     </ScheduleComponent>
//   );
// };

// export default AvailabilityCalendar;



// 2

import React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';

const AvailabilityCalendar = ({ events }) => {
  return (
    <ScheduleComponent currentView='Month' eventSettings={{ dataSource: events }}>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
  );
};

export default AvailabilityCalendar;







