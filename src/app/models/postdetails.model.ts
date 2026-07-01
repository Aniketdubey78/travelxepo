export interface postdetail{
        title: string,
        routeFrom:string,
        routeTo:string,
        startDate: string,
        endDate: string,
        transportMode: string,
        busOperator: string,
        busType: string,
        rating: number,

        // Step 2: Pitstops
        pitstops: Pitstop[],

        // Step 3: Hotels & Restaurants
        hotels: HotelStay[],
        restaurants: Restaurant[],

        // Step 4: Adventures
        adventures: Adventure[],

        // Step 5: Budget
        totalBudget: number,
        expenses: expensesItem[],
        valueForMoney: number,
        moneySavingTips: string,

        // Step 6: Story
        tripSummary: string,
        fullStory: string,
        highlights: string[],
        challenges: string,
        bestTimeToVisit: string,
        travelersFor: travelconfig
        proTips: string,
        wouldRecommend: boolean,
        overallRating: number,

        //extrafield for safety

        postId:string,
        currentpostId:string,
        UserId:string
}

export interface travelconfig{
           'soloTraveler': boolean,
            'couples': boolean,
            'family': boolean,
            'friendsGroup': boolean,
            'backpackers': boolean

             [key: string]: boolean; 
}

export interface expensesItem{
  description:string,
  category:string,
  amount:number
}
export interface Pitstop {
  name: string
  duration: string
  places: string[]
  highlights: string
 
}
export interface HotelStay {
  name: string
  location: string
  nights: string
  pricePerNight: string
  rating: number
  roomType: string
  highlights: string
 
}
export interface Restaurant {
  name: string
  location: string
  cuisine: string
  mustTryDishes: string[]
  avgCost: string
  rating: number
}
export interface Adventure {
  name: string
  location: string
  type: string
  duration: string
  cost: string
  rating: number
  difficulty: string
  tips: string
  bookingRequired: boolean
}

