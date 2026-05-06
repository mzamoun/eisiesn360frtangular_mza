import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantService } from 'src/app/service/consultant.service';
import { LoggerService } from 'src/app/service/logger.service';
import { PasswordValidatorService } from 'src/app/service/password-validator.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.divUrl;

@Component({
  selector: 'app-valid-email',
  templateUrl: './valid-email.component.html',
  styleUrls: ['./valid-email.component.css']
})
export class ValidateEmailComponent implements OnInit {

  codeEmail = '';
  message = '';
  isLoading = true;
  isSuccess = false;
  validationType: 'inscription' | 'resetPassword' = 'inscription';
  
  // Pour resetPassword et validation
  consultant: Consultant = null;
  showPasswordForm = false;
  email = '';
  newPassword = '';
  confirmPassword = '';
  passwordErrors: string[] = [];
  isSubmittingPassword = false;

  constructor(private logger: LoggerService, 
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router,
    private passwordValidator: PasswordValidatorService,
    private consultantService: ConsultantService,
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.logger.debug('ValidateEmailComponent ngOnInit appelé!');
    
    // Déterminer le type de validation basé sur la route
    const url = this.router.url;
    this.logger.debug('URL actuelle:', url);
    
    if (url.includes('resetPassword')) {
      this.validationType = 'resetPassword';
      this.logger.debug('Type de validation: resetPassword');
    } else {
      this.validationType = 'inscription';
      this.logger.debug('Type de validation: INSCRIPTION');
    }

    this.codeEmail = this.route.snapshot.paramMap.get('code') ?? '';

    this.logger.debug('Code reçu:', this.codeEmail);

    if (!this.codeEmail) {
      this.message = 'Code de validation manquant.';
      this.isLoading = false;
      return;
    }

    this.validate();
  }

  validate() {
    const label = this.validationType === 'resetPassword' 
      ? 'resetPasswordValidation' 
      : 'emailInscriptionValidation';
    
    this.logger.debug(label + ': START - Début de la validation');
    this.logger.debug(label + ': code = ' + this.codeEmail);
    this.logger.debug(label + ': type = ' + this.validationType);
    
    this.isLoading = true;
    this.message = 'Validation en cours...';

    // Choisir l'endpoint en fonction du type de validation
    const endpoint = this.validationType === 'resetPassword'
      ? '/msg/resetPassword'
      : '/msg/validateEmail';

    const url = `${API_URL}${endpoint}/${this.codeEmail}`;
    this.logger.debug(label + ': URL API = ' + url);

    this.http.post(url, {}).subscribe({
      next: (resp) => {
        this.logger.debug(label + ': HTTP response reçue');
        this.logger.debug(label + ': response body = ', resp);
        
        const consultant = resp && resp["body"] && resp["body"].result ? resp["body"].result : null;
        
        this.logger.debug(label + ': consultant = ', consultant);
        
        if (consultant) {
          this.logger.debug(label + ': ✅ Validation RÉUSSIE - consultant trouvé');
          
          this.isLoading = false;
          this.isSuccess = true;
          this.consultant = consultant;
          
          if (this.validationType === 'resetPassword') {
            this.logger.debug(label + ': Email du consultant: ' + consultant.email);
            
            // Récupérer l'email du consultant
            this.email = consultant.email || '';
            this.logger.debug(label + ': Email affiché: ' + this.email);
            
            this.message = '✅ Code valide. Veuillez saisir votre nouveau mot de passe.';
            this.logger.debug(label + ': Affichage du formulaire de reset password');
            this.showPasswordForm = true;
          } else {
            this.message = '✅ Validation email réussie. Redirection en cours...';
            this.logger.debug(label + ': Redirection vers /login dans 4 secondes...');
            
            // Redirection après quelques secondes pour inscription
            setTimeout(
              () => {
                this.logger.debug(label + ': URL courant avant redirection: ' + this.router.url);
                
                if (this.router.url !== '/login') {
                  this.logger.debug(label + ': Navigation vers /login');
                  this.router.navigate(['/login']);
                } else {
                  this.logger.debug(label + ': Déjà sur /login, pas de redirection');
                }
              }
              , 4000);
          }
          
          this.logger.debug(label + ': Message affiché: ' + this.message);
        } else {
          this.logger.debug(label + ': ❌ Validation ÉCHOUÉE - consultant = null');
          
          this.isLoading = false;
          this.isSuccess = false;
          
          if (this.validationType === 'resetPassword') {
            this.message = '❌ La réinitialisation du mot de passe a échoué.';
          } else {
            this.message = '❌ La validation de l\'email a échoué.';
          }
          
          this.logger.debug(label + ': Message affiché: ' + this.message);
        }
      },
      error: (err) => {
        console.error(label + ': ❌ ERREUR HTTP');
        console.error(label + ': err.status = ' + err.status);
        console.error(label + ': err.statusText = ' + err.statusText);
        console.error(label + ': err.message = ' + err.message);
        console.error(label + ': Full error = ', err);
        
        this.isLoading = false;
        this.isSuccess = false;
        
        if (err.status === 404) {
          if (this.validationType === 'resetPassword') {
            this.message = '❌ Ce lien de réinitialisation est invalide ou expiré.';
            console.error(label + ': Erreur 404 - Lien invalide ou expiré');
          } else {
            this.message = '❌ Ce lien de validation est invalide ou expiré.';
            console.error(label + ': Erreur 404 - Lien invalide ou expiré');
          }
        }
        else { 
          this.message = '⚠️ Une erreur est survenue lors de la validation.';
          console.error(label + ': Erreur ' + err.status + ' - Erreur serveur');
        }
        
        console.error(label + ': Message affiché: ' + this.message);
      }
    });
  }

  /**
   * Valide le nouveau password pour resetPassword
   */
  validateNewPassword(): void {
    const result = this.passwordValidator.validate(this.newPassword);
    this.passwordErrors = result.errors;
  }

  /**
   * Soumet le nouveau password au backend
   */
  submitNewPassword(): void {
    const label = 'submitNewPassword';
    
    this.logger.debug(label + ': START - Soumission du nouveau password');
    this.logger.debug(label + ': consultant = ', this.consultant);
    this.logger.debug(label + ': code = ' + this.codeEmail);

    // Vérifier que le consultant est défini (récupéré lors de la validation)
    if (!this.consultant) {
      this.message = '❌ Consultant non trouvé. Veuillez réessayer le lien de réinitialisation.';
      console.error(label + ': Consultant manquant');
      return;
    }

    // Vérifier que les passwords matchent
    if (this.newPassword !== this.confirmPassword) {
      this.message = '❌ Les mots de passe ne correspondent pas.';
      console.error(label + ': Les passwords ne correspondent pas');
      return;
    }

    // Vérifier qu'il n'y a pas d'erreurs de validation
    if (this.passwordErrors && this.passwordErrors.length > 0) {
      this.message = '❌ Le mot de passe ne respecte pas les critères requis.';
      console.error(label + ': Erreurs de validation: ', this.passwordErrors);
      return;
    }

    this.isSubmittingPassword = true;
    this.message = 'Mise à jour en cours...';

    this.logger.debug(label + ': Mise à jour du consultant');
    this.logger.debug(label + ': ID: ' + this.consultant.id);

    // Mettre à jour le consultant avec le nouveau password et le code de reset
    this.consultant.password = this.newPassword;
    this.consultant.codeEmailToValidate = this.codeEmail;

    this.logger.debug(label + ': password défini');
    this.logger.debug(label + ': codeEmailToValidate = ' + this.consultant.codeEmailToValidate);
    this.logger.debug(label + ': Appel consultantService.savePost...');

    // Sauvegarder le consultant
    this.consultantService.savePost(this.consultant, true).subscribe({
      next: (saveResp) => {
        this.logger.debug(label + ': ✅ Password mis à jour avec succès');
        this.logger.debug(label + ': Response: ', saveResp);

        this.isSubmittingPassword = false;
        this.isSuccess = true;
        this.message = '✅ Mot de passe mis à jour avec succès! Redirection vers la connexion...';
        this.showPasswordForm = false;

        setTimeout(() => {
          this.logger.debug(label + ': Navigation vers /login');
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (saveErr) => {
        console.error(label + ': ❌ Erreur lors de la sauvegarde du consultant');
        console.error(label + ': err.status = ' + saveErr.status);
        console.error(label + ': Full error = ', saveErr);

        this.isSubmittingPassword = false;

        if (saveErr.status === 404) {
          this.message = '❌ Ce consultant n\'existe plus.';
        } else if (saveErr.status === 400) {
          this.message = '❌ Les données envoyées sont invalides.';
        } else {
          this.message = '⚠️ Une erreur est survenue lors de la mise à jour du mot de passe.';
        }

        console.error(label + ': Message affiché: ' + this.message);
      }
    });
  }
}
