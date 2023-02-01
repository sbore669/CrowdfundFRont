import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Projets } from '../Model/projets';
import { AuthService } from '../_services/auth.service';
import { ProjetsService } from '../_services/projets.service';
import { StorageService } from '../_services/storage.service';
import { TypeprojetsService } from '../_services/typeprojets.service';

@Component({
  selector: 'app-dashbord-start',
  templateUrl: './dashbord-start.page.html',
  styleUrls: ['./dashbord-start.page.scss'],
})
export class DashbordStartPage implements OnInit {

  suivant: boolean = true;

  presentingElement: any;
  currentUser: any
  selectedFile!: File;
  projets: Projets = new Projets();
  Idtypeprojets!: number;
  id_users!: number;
  

  
  step = 1;
  typesProjet: any;
  sommetotale: any;
  nbreprojets: any;
  

  constructor(private authService: AuthService,
     private storageService: StorageService,
     private router: Router,
     private projetsService: ProjetsService,
     private typeprojets: TypeprojetsService) { }

  

  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.presentingElement = document.querySelector('.ion-page');
    console.log(this.currentUser);
    this.typeprojets.listetypeprojets().subscribe(data =>{
      this.typesProjet = data
      console.log(data)
    })
    this.recupererTotalstartups();
    this.recupererTotalprojetsParstartups();
  }

  nextStep(){
    this.suivant = false;
    this.step++;
  }
  backStep(){
    this.suivant = true;
    this.step--;
  }
  options={
    slidesPerView:1,   // NOMBRE DE SLIDE PAR PAGE = 1
    centeredSlider:true,
   // loop:true,
    spaceBetween:10,
    autoplay:false
  }



  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onSubmit(form: NgForm) {
    console.log(this.projets);
    this.projetsService.creerprojets(this.currentUser.id, this.Idtypeprojets, this.selectedFile, this.projets)
      .subscribe( res => {
        console.log(res);
        Swal.fire({
          heightAuto: false,
          icon: 'success',
          text: 'Projet créé avec succès',
          showConfirmButton: false,
          timer: 2500
        })
        this.router.navigateByUrl('/tabs/projetstartups');
        // modal.dismiss();
        if (res.message == "Projet créé avec succès") {
          
        } else {
          console.log("erreur");
        }
      });
  }

  recupererTotalstartups(){
    const id_users = this.currentUser.id
    this.projetsService.lasommedesprojetsStartups(id_users).subscribe(data =>{
      this.sommetotale = data
      console.log(this.sommetotale)
    })
  }

  recupererTotalprojetsParstartups(){
    const id_users = this.currentUser.id
    this.projetsService.nombredeprojetsparStartups(id_users).subscribe(data =>{
      this.nbreprojets = data
      console.log(this.nbreprojets)
    })
  }

  // recupererProjetStartups(){
  //   const id_users = this.currentUser.id
  //   console.log(id_users);
  //   this.projetsService.recupererProjetsStartups(id_users).subscribe(data =>{
  //     this.vostartups = data
  //     console.log(this.vostartups)
  //   });
  // }


}
