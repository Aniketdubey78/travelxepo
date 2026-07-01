import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Adventure, expensesItem, HotelStay, Pitstop, postdetail, Restaurant, travelconfig } from '../../../models/postdetails.model';
import { PostserviceService } from '../../../services/postservice.service';
import { isPlatformBrowser } from '@angular/common';




@Component({
    selector: 'app-post-details-form',
    standalone: false,
    templateUrl: './post-details-form.component.html',
    styleUrl: './post-details-form.component.css'
})
export class PostDetailsFormComponent {

    @Input() postid: string=''

    currentStep = 1;
    totalSteps = 6;
    constructor(@Inject(PLATFORM_ID) private platformId: Object, private postservice: PostserviceService) {

    }

    steps = [
        'Trip & Transport',
        'Pitstops',
        'Hotels & Food',
        'Adventures',
        'Budget',
        'Your Story'
    ];

    transportModes = ['Bus', 'Car', 'Train', 'Flight', 'Motorcycle'];
    travelerTypes: Array<keyof travelconfig> = ['Solo Traveler', 'Couples', 'Family', 'Friends Group', 'Backpackers'];
    expenseCategories = ['Transport', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Miscellaneous'];

    // Initialize form object
    formData: postdetail = {
        // Step 1: Trip & Transport
        title: '',
        routeFrom: '',
        routeTo: '',
        startDate: '',
        endDate: '',
        transportMode: '',
        busOperator: '',
        busType: '',
        rating: 0,

        // Step 2: Pitstops
        pitstops: [],

        // Step 3: Hotels & Restaurants
        hotels: [],
        restaurants: [],

        // Step 4: Adventures
        adventures: [],

        // Step 5: Budget
        totalBudget: 0,
        expenses: [],
        valueForMoney: 0,
        moneySavingTips: '',

        // Step 6: Story
        tripSummary: '',
        fullStory: '',
        highlights: [],
        challenges: '',
        bestTimeToVisit: '',
        travelersFor: {
            'soloTraveler': false,
            'couples': false,
            'family': false,
            'friendsGroup': false,
            'backpackers': false
        },
        proTips: '',
        wouldRecommend: false,
        overallRating: 0,

        //extras field

        postId: '',
        UserId: '',
        currentpostId: ''

    };

    // Temporary inputs
    newPitstop: Pitstop = {
        name: '',
        places: [],
        duration: '',
        highlights: ''
    };
    pitstopPlaceInput = '';

    newHotel: HotelStay = {
        name: '',
        location: '',
        pricePerNight: '',
        nights: '',
        rating: 0,
        roomType: '',
        highlights: ''

    };
    newRestaurant: Restaurant = {
        name: '',
        location: '',
        cuisine: '',
        mustTryDishes: [],
        avgCost: '',
        rating: 0
    };

    newAdventure: Adventure = {
        name: '',
        location: '',
        type: '',
        duration: '',
        cost: '',
        rating: 0,
        difficulty: '',
        tips: '',
        bookingRequired: false
    };

    newExpense: expensesItem = {
        description: '',
        category: '',
        amount: 0
    };

    highlightInput = '';



    ngOnInit() {
        if (this.postid ) {
            this.formData.postId = this.postid
            console.log(this.formData.postId)
            console.log(this.postid)
        }
    }

    // Calculate progress percentage
    progressPercentage() {
        let filledFields = 0;
        let totalFields = 0;

        // Step 1 fields
        if (this.currentStep >= 1) {
            totalFields += 6; // title, from, to, startDate, endDate, transportMode
            if (this.formData.title) filledFields++;
            if (this.formData.routeFrom) filledFields++;
            if (this.formData.routeTo) filledFields++;
            if (this.formData.startDate) filledFields++;
            if (this.formData.endDate) filledFields++;
            if (this.formData.transportMode) filledFields++;
        }

        // Step 2 fields
        if (this.currentStep >= 2) {
            totalFields += 1;
            if (this.formData.pitstops.length > 0) filledFields++;
        }

        // Step 3 fields
        if (this.currentStep >= 3) {
            totalFields += 1;
            if (this.formData.hotels.length > 0 || this.formData.restaurants.length > 0) filledFields++;
        }

        // Step 4 fields
        if (this.currentStep >= 4) {
            totalFields += 1;
            if (this.formData.adventures.length > 0) filledFields++;
        }

        // Step 5 fields
        if (this.currentStep >= 5) {
            totalFields += 2;
            if (this.formData.totalBudget > 0) filledFields++;
            if (this.formData.valueForMoney > 0) filledFields++;
        }

        // Step 6 fields
        if (this.currentStep >= 6) {
            totalFields += 3;
            if (this.formData.tripSummary) filledFields++;
            if (this.formData.fullStory) filledFields++;
            if (this.formData.overallRating > 0) filledFields++;
        }

        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    };



    goToStep(step: number): void {
        if (step >= 1 && step <= this.totalSteps && this.isStepValid()) {
            this.currentStep = step;
            console.log(`Navigating to Step: ${this.currentStep}`);
        } else {
            console.warn('Navigation invalid: step boundaries out of range or data verification failed.');
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps && this.isStepValid()) {
            this.currentStep++;
        }
    };

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    };

    // Validation
    isStepValid() {
        switch (this.currentStep) {
            case 1:
                return this.formData.title &&
                    this.formData.routeFrom &&
                    this.formData.routeTo &&
                    this.formData.startDate &&
                    this.formData.endDate &&
                    this.formData.transportMode &&
                    this.formData.rating > 0;

            case 2:
                return this.formData.pitstops.length > 0;

            case 3:
                return this.formData.hotels.length > 0 || this.formData.restaurants.length > 0;

            case 4:
                return true; // Adventures are optional

            case 5:
                return this.formData.totalBudget > 0 && this.formData.valueForMoney > 0;

            case 6:
                return this.formData.tripSummary &&
                    this.formData.fullStory &&
                    this.formData.overallRating > 0;

            default:
                return false;
        }
    };

    // Step 2: Pitstops functions
    addPitstopPlace() {
        if (this.pitstopPlaceInput.trim()) {
            if (!this.newPitstop.places) {
                this.newPitstop.places = [];
            }
            this.newPitstop.places.push(this.pitstopPlaceInput.trim());
            this.pitstopPlaceInput = '';
        }
    };

    addPitstop() {
        if (this.newPitstop.name && this.newPitstop.places.length > 0) {
            const pitcopy = JSON.parse(JSON.stringify(this.newPitstop))
            this.formData.pitstops.push(pitcopy);
            this.newPitstop = { name: '', places: [], duration: '', highlights: '' };
            this.pitstopPlaceInput = '';
        } else {
            alert('Please add place name and at least one explored location');
        }
    };

    removePitstop(index: number) {
        this.formData.pitstops.splice(index, 1);
    };

    // Step 3: Hotels functions
    addHotel() {
        if (this.newHotel.name && this.newHotel.location) {
            const hotel = JSON.parse(JSON.stringify(this.newHotel))
            this.formData.hotels.push(hotel);
            this.newHotel = {
                name: '',
                location: '',
                pricePerNight: '',
                nights: '',
                rating: 0,
                roomType: '',
                highlights: ''
            };
        } else {
            alert('Please fill in hotel name and location');
        }
    };

    removeHotel(index: number) {
        this.formData.hotels.splice(index, 1);
    };

    // Step 3: Restaurants functions
    addRestaurant() {
        if (this.newRestaurant.name && this.newRestaurant.location) {
            const resturants = JSON.parse(JSON.stringify(this.newRestaurant))
            this.formData.restaurants.push(resturants);
            this.newRestaurant = {
                name: '',
                location: '',
                cuisine: '',
                mustTryDishes: [],
                avgCost: '',
                rating: 0
            };
        } else {
            alert('Please fill in restaurant name and location');
        }
    };

    removeRestaurant(index: number) {
        this.formData.restaurants.splice(index, 1);
    };

    // Step 4: Adventures functions
    addAdventure() {
        if (this.newAdventure.name && this.newAdventure.location && this.newAdventure.type) {
            const adventure = JSON.parse(JSON.stringify(this.newAdventure))
            this.formData.adventures.push(adventure);
            this.newAdventure = {
                name: '',
                location: '',
                type: '',
                duration: '',
                cost: '',
                rating: 0,
                difficulty: '',
                tips: '',
                bookingRequired: false
            };
        } else {
            alert('Please fill in adventure name, location, and type');
        }
    };

    removeAdventure(index: number) {
        this.formData.adventures.splice(index, 1);
    };

    // Step 5: Budget functions
    addExpense() {
        if (this.newExpense.description && this.newExpense.category && this.newExpense.amount > 0) {
            const expense = JSON.parse(JSON.stringify(this.newExpense))
            this.formData.expenses.push(expense);
            this.newExpense = { description: '', category: '', amount: 0 };
        } else {
            alert('Please fill in all expense fields');
        }
    };

    removeExpense(index: number) {
        this.formData.expenses.splice(index, 1);
    };

    getExpenseTotal(category: string) {
        return this.formData.expenses
            .filter(e => e.category.trim() === category.trim())
            .reduce((sum, e) => sum + (e.amount || 0), 0)
            .toFixed(2);
    };

    getExpenseCount(category: string) {
        return this.formData.expenses.filter(e => e.category.trim() === category.trim()).length;
    };

    // Step 6: Highlights
    addHighlight() {
        if (this.highlightInput.trim()) {
            this.formData.highlights.push(this.highlightInput.trim());
            this.highlightInput = '';
        }
    };

    // Form submission
    submitForm() {
        if (this.isStepValid()) {
            this.formData.currentpostId = self.crypto.randomUUID();
            if (isPlatformBrowser(this.platformId)) {

                const loginDetails = sessionStorage.getItem('Loggedinuser');
                if (loginDetails) {
                    const parsedUser = JSON.parse(loginDetails);
                    this.formData.UserId = parsedUser?.data?.user?.id || null;
                }
            }


            console.log('Form Data:', this.formData);
            alert('Journey post created successfully!\n\nCheck console for complete data.');
            this.postservice.postdetailsrequest(this.formData).subscribe({
                next: (response: any) => {
                    console.log("response of multiform is", response);
                }
            })

        } else {
            alert('Please fill in all required fields');
        }
    };
}
