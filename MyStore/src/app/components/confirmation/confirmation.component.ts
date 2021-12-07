import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  totalPrice: number = 0;
  fullName: String = '';

  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    // Get the order total price and name from the parameters
    this.route.queryParams.subscribe(params => {
      if (params['totalPrice'] && params['fullName']) {
        this.totalPrice = params['totalPrice'];
        this.fullName = params['fullName'];
      } else {
        this.router.navigate(['/error']);
      }
    });
  }

}
