import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Route, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { PostserviceService } from '../../../services/postservice.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-fulljourney-page',
  standalone: false,
  templateUrl: './fulljourney-page.component.html',
  styleUrl: './fulljourney-page.component.css'
})
export class FulljourneyPageComponent implements OnInit {
  isToastNotificationActive: boolean = false
  currentSlideIndex: number = 0;
  journeyobject: any = null;
  currentpost: string = ''
  isFormOpen: boolean = false

  userID: string = '';


  constructor(private router: Router, private postService: PostserviceService,
    @Inject(PLATFORM_ID) private platformId: Object, private notifyservice: NotificationService) {
    const navigation = this.router.getCurrentNavigation();
    const statedata = navigation?.extras?.state?.['currentpost']


    if (statedata) {
      this.journeyobject = { ...statedata }
      console.log(this.journeyobject)
      this.currentpost = this.journeyobject._id
      console.log(this.currentpost)
    }

  }

  postsaved: boolean = false;
  completionPercentage: number = 0;
  formData: any = null;
  reviewsList: any[] = [];


  activeSections: any = {
    trip: true,
    pitstops: false,
    stays: false,
    adventures: false,
    budget: false,
    story: true
  };


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      const user = sessionStorage.getItem("Loggedinuser");
      if (user) {
        const userData = JSON.parse(user);
        console.log(userData);

        this.userID = userData.data?.user?.id;
      }

      if (this.currentpost) {
        this.postService.ftechusercomement(this.currentpost).subscribe({
          next: (res: any) => {
            const reviewsData =  res.data || [];
            this.reviewsList = reviewsData;
            console.log('Fetched reviews response', res);
            console.log('Parsed reviewsList', this.reviewsList);
          },
          error: (err: any) => {
            console.error('Error fetching reviews', err);
          }
        });
      }

      this.loadJourneyDataFromService();


    }

  }
  prevSlide() {
    if (!this.journeyobject.image) return

    if (this.currentSlideIndex === 0) {
      this.currentSlideIndex = this.journeyobject.image.length - 1;
    } else {
      this.currentSlideIndex--;
    }
  }
  nextSlide() {
    if (!this.journeyobject.image) return

    if (this.currentSlideIndex === this.journeyobject.image.length - 1) {
      this.currentSlideIndex = 0;
    } else {
      this.currentSlideIndex++;
    }
  }
  goToSlide(idx: number) {
    this.currentSlideIndex = idx
  }


  loadJourneyDataFromService() {

    this.postService.fetchjourney(this.currentpost).subscribe({
      next: (dbPayload: any) => {
        if (dbPayload) {
          this.formData = dbPayload.data;
          console.log(this.formData)
          this.calculateCompletion();
        }
      },
      error: (err: any) => console.error('Error fetching data properties from service stream', err)
    });
  }


  calculateCompletion() {
    if (!this.formData) {
      this.completionPercentage = 0;
      return;
    }

    let filledSteps = 0;
    const totalStepsCount = 6;


    if (this.formData.title && this.formData.routeFrom && this.formData.routeTo) filledSteps++;
    if (this.formData.pitstops && this.formData.pitstops.length > 0) filledSteps++;
    if ((this.formData.hotels && this.formData.hotels.length > 0) || (this.formData.restaurants && this.formData.restaurants.length > 0)) filledSteps++;
    if (this.formData.adventures && this.formData.adventures.length > 0) filledSteps++;
    if (this.formData.totalBudget > 0 || (this.formData.expenses && this.formData.expenses.length > 0)) filledSteps++;
    if (this.formData.tripSummary || this.formData.fullStory) filledSteps++;

    this.completionPercentage = Math.round((filledSteps / totalStepsCount) * 100);
  }


  hasFilledData(sectionKey: string): boolean {
    if (!this.formData) return false;

    switch (sectionKey) {
      case 'trip':
        return !!(this.formData.routeFrom || this.formData.routeTo || this.formData.transportMode);
      case 'pitstops':
        return !!(this.formData.pitstops && this.formData.pitstops.length > 0);
      case 'stays':
        return !!((this.formData.hotels && this.formData.hotels.length > 0) || (this.formData.restaurants && this.formData.restaurants.length > 0));
      case 'adventures':
        return !!(this.formData.adventures && this.formData.adventures.length > 0);
      case 'budget':
        return !!(this.formData.totalBudget > 0 || (this.formData.expenses && this.formData.expenses.length > 0));
      case 'story':
        return !!(this.formData.tripSummary || this.formData.fullStory || this.formData.challenges);
      default:
        return false;
    }
  }


  toggleSection(section: string) {
    this.activeSections[section] = !this.activeSections[section];
  }

  openForm() {
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }


  getDurationInDays(): number {
    if (!this.formData?.startDate || !this.formData?.endDate) return 0;
    const start = new Date(this.formData.startDate).getTime();
    const end = new Date(this.formData.endDate).getTime();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  renderStars(count: number): number[] {
    const starsCount = Math.max(0, Math.min(5, Math.floor(count || 0)));
    return Array(starsCount).fill(0);
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return '';
    return new Date(dateInput).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  }


  getRecommendedTravelers(): string[] {
    if (!this.formData?.travelersFor) return [];

    const targets = this.formData.travelersFor;
    const matchedBadges: string[] = [];


    if (targets['Solo Traveler'] || targets.soloTraveler) matchedBadges.push('Solo Traveler');
    if (targets['Couples'] || targets.couples) matchedBadges.push('Couples');
    if (targets['Family'] || targets.family) matchedBadges.push('Family');
    if (targets['Friends Group'] || targets.friendsGroup) matchedBadges.push('Friends Group');
    if (targets['Backpackers'] || targets.backpackers) matchedBadges.push('Backpackers');

    return matchedBadges;
  }


  async showModal(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }


    const currentUrl: string = `${window.location.origin}/feeds/${this.journeyobject?._id}`;

    const source = this.journeyobject?.routeFrom || this.journeyobject?.routefrom || 'Source';
    const destination = this.journeyobject?.routeTo || this.journeyobject?.routeto || 'Destination';
    const shareMessageText = `Take a look at this beautiful travel story: "${this.journeyobject?.title || 'Amazing Journey'}" from ${source} ➔ ${destination}! 🚌✨`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: this.journeyobject?.title || 'Travel Blog Feed',
          text: shareMessageText,
          url: currentUrl
        });
        console.log('Telemetry node packet distributed smoothly across platform system pipelines.');
      } catch (userCancelError) {
        console.log('Share dialogue panel closed or cancelled by active pointer device execution:', userCancelError);
      }
    }

    else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        this.displayTemporaryToastMessage();
      } catch (clipboardError) {
        console.error('Core permission matrix denied clipboard write access tokens:', clipboardError);
      }
    }
  }
  private displayTemporaryToastMessage(): void {
    this.isToastNotificationActive = true;
    setTimeout(() => {
      this.isToastNotificationActive = false;
    }, 3000);
  }

  savepost() {
    this.postService.savedpostinDB(this.journeyobject?._id, this.journeyobject?.authorId?._id);
    this.postsaved = true;
  }
  private sendUpdatedFlags(): void {
    this.notifyservice.emitPostFlags(this.userID, this.journeyobject?._id).subscribe({
      next: (res: any) => {
        console.log('Post flags updated successfully:', res);
      }
    })
  }

  handleLike(): void {
    this.sendUpdatedFlags();
    this.isLiked = !this.isLiked;
  }


  handleSave(): void {
    this.sendUpdatedFlags();
    this.isSaved = !this.isSaved;
  }

  isLiked: boolean = false;
  isSaved: boolean = false;

}
