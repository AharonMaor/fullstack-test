import { Component, OnInit } from '@angular/core';
import { PublisherCardComponent } from './publisher-card/publisher-card.component';
import { DomainCardComponent } from './domain-card/domain-card.component'; 
import { CommonModule } from '@angular/common';
import { Publisher,Domain } from '../../types';
import { HttpService } from '../../http.service';

@Component({
    selector: 'app-publishers-container',
    standalone: true,
    imports: [PublisherCardComponent, CommonModule,DomainCardComponent],
    templateUrl: './publishers-container.component.html',
    styleUrl: './publishers-container.component.css',
})
export class PublishersContainerComponent implements OnInit {
    constructor(private httpService: HttpService) {}

    publishers: Array<Publisher> = [];
    domains: { [key: string]: Domain[] } = {};

    ngOnInit(): void {
        this.httpService.getPublishers().subscribe((data) => {
            //console.log(data);
            this.publishers = data;
            
        });
      }

      fetchDomains(publisherName: string) {
        this.httpService.getDomainsByPublisher(publisherName).subscribe((data) => {
            console.log(data);
            this.domains[publisherName] = data; // Store domains for the specific publisher
            console.log(this.domains);
        }, (error) => {
            console.error('Error fetching domains:', error);
        });
    }
    

      addPublisher() {
        const publisherName = prompt('Enter the name of the new publisher:');
        
        if (publisherName) {
          const domains = [];
          
          let addAnotherDomain = true;

          
          while (addAnotherDomain) {
            const url = prompt('Enter the domain URL : ');
            if (!url || !url.includes('.com')) {
              alert('Invalid URL! The domain must contain ".com".');
              continue;
            }
      
            const desktopAds = Number(prompt('Enter the number of desktop ads : '));
            if (isNaN(desktopAds) || desktopAds < 0) {
              alert('Invalid input! Desktop ads must be a non-negative number.');
              continue;
            }
      
            const mobileAds = Number(prompt('Enter the number of mobile ads : '));
            if (isNaN(mobileAds) || mobileAds < 0) {
              alert('Invalid input! Mobile ads must be a non-negative number.');
              continue;
            }
      
            domains.push({ url, desktopAds, mobileAds });

            // Ask the user if they want to add another domain ( Each Publisher can have a number of Domains )
            addAnotherDomain = confirm('Do you want to add another domain?');
          }
          console.log(domains);

          const newPublisher = { publisher: publisherName, domains: domains };
      
          this.httpService.addPublisher(newPublisher).subscribe((addedPublisher) => {
            this.publishers.unshift(addedPublisher);
          }, (error) => {
            console.error('Error adding publisher:', error);
          });
        }
      }   
}

