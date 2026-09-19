import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (isVisible) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-glow-effect"></div>
          <div class="modal-header">
            <div class="icon-wrapper">
              <mat-icon class="warning-icon">warning</mat-icon>
              <div class="icon-pulse"></div>
            </div>
            <h3>{{ title }}</h3>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="onCancel()">
              <span class="btn-text">{{ cancelText }}</span>
              <div class="btn-glow"></div>
            </button>
            <button class="btn-confirm" (click)="onConfirm()">
              <span class="btn-text">{{ confirmText }}</span>
              <div class="btn-shine"></div>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* ============================================
       Modal overlay con backdrop blur
       ============================================ */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px) brightness(0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ============================================
       Modal container con efectos 3D
       ============================================ */
    .modal-container {
      position: relative;
      background: linear-gradient(135deg, #1a1f3a 0%, #162040 100%);
      border-radius: 16px;
      padding: 32px;
      max-width: 450px;
      width: 90%;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.8),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-style: preserve-3d;
      perspective: 1000px;
      overflow: hidden;
    }

    /* ============================================
       Glow effect behind modal
       ============================================ */
    .modal-glow-effect {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(245, 158, 11, 0.1) 0%,
        transparent 70%
      );
      animation: glowPulse 3s ease-in-out infinite;
      pointer-events: none;
    }

    /* ============================================
       Modal header mejorado
       ============================================ */
    .modal-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
    }

    .modal-header h3 {
      margin: 0;
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    /* ============================================
       Icon wrapper con animación
       ============================================ */
    .icon-wrapper {
      position: relative;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .warning-icon {
      color: #f59e0b;
      font-size: 32px;
      width: 32px;
      height: 32px;
      filter: drop-shadow(0 4px 12px rgba(245, 158, 11, 0.5));
      animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 2;
    }

    .icon-pulse {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle,
        rgba(245, 158, 11, 0.3) 0%,
        transparent 70%
      );
      border-radius: 50%;
      animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* ============================================
       Modal body
       ============================================ */
    .modal-body {
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .modal-body p {
      margin: 0;
      color: #cbd5e0;
      font-size: 1rem;
      line-height: 1.6;
      font-weight: 400;
    }

    /* ============================================
       Modal footer con botones mejorados
       ============================================ */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .btn-cancel,
    .btn-confirm {
      position: relative;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    /* ============================================
       Botón Cancelar
       ============================================ */
    .btn-cancel {
      background: linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.3);
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .btn-cancel:hover {
      transform: translateY(-2px) scale(1.02);
      background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(148, 163, 184, 0.1) 100%);
      color: #ffffff;
      border-color: rgba(148, 163, 184, 0.5);
      box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .btn-cancel:active {
      transform: translateY(0) scale(0.98);
    }

    .btn-cancel .btn-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(148, 163, 184, 0.3),
        transparent
      );
      transition: left 0.5s ease;
    }

    .btn-cancel:hover .btn-glow {
      left: 100%;
    }

    /* ============================================
       Botón Confirmar (Eliminar)
       ============================================ */
    .btn-confirm {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border: 1px solid rgba(239, 68, 68, 0.4);
      box-shadow: 
        0 4px 16px rgba(239, 68, 68, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .btn-confirm:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 
        0 12px 28px rgba(239, 68, 68, 0.5),
        0 0 40px rgba(239, 68, 68, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      border-color: rgba(239, 68, 68, 0.6);
    }

    .btn-confirm:active {
      transform: translateY(-1px) scale(1.02);
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.6s ease;
    }

    .btn-confirm:hover .btn-shine {
      left: 100%;
    }

    .btn-confirm .btn-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.4),
        transparent 70%
      );
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease;
    }

    .btn-confirm:hover .btn-glow {
      width: 300px;
      height: 300px;
    }

    /* ============================================
       Animaciones
       ============================================ */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(40px) rotateX(-10deg) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotateX(0) scale(1);
      }
    }

    @keyframes iconBounce {
      0% {
        transform: scale(0) rotate(-45deg);
      }
      50% {
        transform: scale(1.2) rotate(10deg);
      }
      100% {
        transform: scale(1) rotate(0);
      }
    }

    @keyframes pulseRing {
      0%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      50% {
        transform: scale(1.2);
        opacity: 0;
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.1);
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isVisible = false;
  @Input() title = "Confirmar acción";
  @Input() message = "¿Estás seguro?";
  @Input() confirmText = "Aceptar";
  @Input() cancelText = "Cancelar";

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}