/**
 * Inquiries Management Module
 * Handles inquiry parsing, management, and quotation generation from inquiries
 */

class InquiriesManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.currentInquiry = null;
        this.initializeEventListeners();
        this.loadInquiries();
    }

    initializeEventListeners() {
        // Modal close
        const modalClose = document.getElementById('inquiryModalClose');
        const modal = document.getElementById('inquiryModal');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    }

    loadInquiries() {
        const inquiries = Storage.getAllInquiries();
        this.displayInquiries(inquiries);
    }

    displayInquiries(inquiries) {
        const tableBody = document.getElementById('inquiriesTable');
        if (!tableBody) return;

        if (inquiries.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                            <div class="empty-state-title">No inquiries yet</div>
                            <p style="color: var(--text-muted);">Submit your first inquiry above</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = inquiries.map(inquiry => `
            <tr>
                <td><strong>${inquiry.customerName}</strong></td>
                <td>${inquiry.email || 'N/A'}</td>
                <td>${inquiry.phone || 'N/A'}</td>
                <td>
                    <span style="
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        ${inquiry.status === 'pending' ? 'background: #fef3c7; color: #92400e;' : 'background: #dcfce7; color: #166534;'}
                    ">
                        ${inquiry.status === 'pending' ? 'Pending' : 'Converted'}
                    </span>
                </td>
                <td>${formatDate(inquiry.createdAt)}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="inquiriesManager.viewInquiry(${inquiry.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="inquiriesManager.quickQuotation(${inquiry.id})" title="Quick Quotation">
                            <i class="fas fa-bolt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="inquiriesManager.deleteInquiry(${inquiry.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Parse inquiry text using AI-style pattern matching
     */
    parseInquiry() {
        const customerName = document.getElementById('inquiryCustomer').value.trim();
        const inquiryDetails = document.getElementById('inquiryDetails').value.trim();

        if (!customerName || !inquiryDetails) {
            appManager.showToast('Please fill customer name and inquiry details', 'error');
            return;
        }

        // Simple AI-style parsing - detect requirements from text
        const parsed = this.extractRequirements(inquiryDetails);
        this.displayParsedDetails(parsed);

        // Save inquiry to storage
        const inquiry = {
            customerName: customerName,
            email: document.getElementById('inquiryEmail').value.trim(),
            phone: document.getElementById('inquiryPhone').value.trim(),
            details: inquiryDetails,
            parsedData: parsed
        };

        this.currentInquiry = inquiry;
    }

    /**
     * Extract requirements from inquiry text using keyword matching
     */
    extractRequirements(text) {
        const lowerText = text.toLowerCase();
        const requirements = {
            type: [],
            hp: null,
            buildings: null,
            pressure: null,
            flow: null,
            material: [],
            quantity: null,
            budget: null,
            timeline: null,
            other: []
        };

        // Detect pump type
        const pumpTypes = ['centrifugal', 'submersible', 'reciprocating', 'rotary', 'gear', 'turbine', 'peristaltic'];
        pumpTypes.forEach(type => {
            if (lowerText.includes(type)) requirements.type.push(type);
        });

        // Detect motor power (HP)
        const hpMatch = text.match(/(\d+\.?\d*)\s*(?:hp|horse\s*power|bhp)/i);
        if (hpMatch) requirements.hp = parseFloat(hpMatch[1]);

        // Detect building/floor information
        const buildingMatch = text.match(/(\d+)\s*(?:story|storey|floor|level|stair)/i);
        if (buildingMatch) requirements.buildings = parseInt(buildingMatch[1]);

        // Detect pressure system
        if (lowerText.includes('pressure') || lowerText.includes('psi') || lowerText.includes('bar')) {
            const pressureMatch = text.match(/(\d+\.?\d*)\s*(?:psi|bar|kpa)/i);
            if (pressureMatch) requirements.pressure = pressureMatch[1] + ' ' + pressureMatch[0].match(/psi|bar|kpa/i)[0];
        }

        // Detect flow rate
        const flowMatch = text.match(/(\d+\.?\d*)\s*(?:gpm|lpm|m3\/h|cum\/h)/i);
        if (flowMatch) requirements.flow = flowMatch[0];

        // Detect material requirements
        const materials = ['stainless', 'steel', 'cast iron', 'bronze', 'plastic', 'ductile'];
        materials.forEach(mat => {
            if (lowerText.includes(mat)) requirements.material.push(mat);
        });

        // Detect quantity
        const quantityMatch = text.match(/(?:need|require|want|supply)\s+(\d+)\s*(?:pump|unit|set|piece)/i);
        if (quantityMatch) requirements.quantity = parseInt(quantityMatch[1]);

        // Detect budget
        const budgetMatch = text.match(/(?:budget|price|cost|rate).*?(?:₹|rs|rupee|inr)\s*(\d+[,\d]*)/i);
        if (budgetMatch) requirements.budget = 'Above ₹' + budgetMatch[1];

        // Detect timeline
        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediate')) {
            requirements.timeline = 'Urgent';
        } else if (lowerText.includes('week')) {
            requirements.timeline = 'Within a week';
        } else if (lowerText.includes('month')) {
            requirements.timeline = 'Within a month';
        }

        return requirements;
    }

    /**
     * Display parsed requirements in UI
     */
    displayParsedDetails(parsed) {
        const container = document.getElementById('parsedDetails');
        
        let html = '<div style="text-align: left;">';

        // Pump Type
        if (parsed.type.length > 0) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(0, 102, 204, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-tag"></i> Pump Type:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.type.join(', ')}</p>
                </div>
            `;
        }

        // Power (HP)
        if (parsed.hp) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(0, 212, 255, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-bolt"></i> Power:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.hp} HP</p>
                </div>
            `;
        }

        // Buildings
        if (parsed.buildings) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(255, 107, 53, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-building"></i> Building:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.buildings} Story/Floor</p>
                </div>
            `;
        }

        // Pressure
        if (parsed.pressure) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-gauge"></i> Pressure:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.pressure}</p>
                </div>
            `;
        }

        // Flow Rate
        if (parsed.flow) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(59, 130, 246, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-water"></i> Flow Rate:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.flow}</p>
                </div>
            `;
        }

        // Quantity
        if (parsed.quantity) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-boxes"></i> Quantity:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.quantity} units</p>
                </div>
            `;
        }

        // Budget
        if (parsed.budget) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(34, 197, 94, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-money-bill"></i> Budget:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.budget}</p>
                </div>
            `;
        }

        // Timeline
        if (parsed.timeline) {
            html += `
                <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: rgba(249, 115, 22, 0.1); border-radius: var(--radius-md);">
                    <strong><i class="fas fa-clock"></i> Timeline:</strong>
                    <p style="margin: 5px 0 0 0; color: var(--text-dark);">${parsed.timeline}</p>
                </div>
            `;
        }

        html += '<button class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-md);" onclick="inquiriesManager.submitParsedInquiry()"><i class="fas fa-check"></i> Submit & Save</button>';
        html += '</div>';

        container.innerHTML = html;
    }

    submitParsedInquiry() {
        if (!this.currentInquiry) {
            appManager.showToast('Please parse an inquiry first', 'error');
            return;
        }

        let customerId;
        const existingCustomer = Storage.getCustomerByEmail(this.currentInquiry.email);

        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const newCustomer = Storage.addCustomer({
                name: this.currentInquiry.customerName,
                email: this.currentInquiry.email,
                phone: this.currentInquiry.phone
            });
            customerId = newCustomer.id;
        }

        const inquiry = Storage.addInquiry({
            customerId: customerId,
            customerName: this.currentInquiry.customerName,
            email: this.currentInquiry.email,
            phone: this.currentInquiry.phone,
            details: this.currentInquiry.details,
            parsedData: this.currentInquiry.parsedData
        });

        appManager.showToast('Inquiry saved successfully!', 'success');

        // Reset form
        document.getElementById('inquiryCustomer').value = '';
        document.getElementById('inquiryEmail').value = '';
        document.getElementById('inquiryPhone').value = '';
        document.getElementById('inquiryDetails').value = '';
        document.getElementById('parsedDetails').innerHTML = `
            <i class="fas fa-info-circle" style="font-size: 24px; margin-bottom: var(--spacing-md);"></i>
            <p>Parsed requirements will appear here</p>
        `;

        this.loadInquiries();
    }

    viewInquiry(id) {
        const inquiry = Storage.getInquiry(id);
        if (!inquiry) return;

        this.currentInquiry = inquiry;

        const modalContent = document.getElementById('inquiryModalContent');
        const parsed = inquiry.parsedData || {};

        let html = `
            <div>
                <h3 style="margin-top: 0;">${inquiry.customerName}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                    <div>
                        <label style="font-weight: 600;">Email</label>
                        <p>${inquiry.email || 'N/A'}</p>
                    </div>
                    <div>
                        <label style="font-weight: 600;">Phone</label>
                        <p>${inquiry.phone || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <label style="font-weight: 600;">Inquiry Details</label>
                    <p style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); color: var(--text-dark);">
                        ${inquiry.details}
                    </p>
                </div>

                <div style="margin-top: var(--spacing-lg);">
                    <label style="font-weight: 600;">Detected Requirements</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-top: var(--spacing-md);">
                        ${parsed.hp ? `<div><strong>Power:</strong> ${parsed.hp} HP</div>` : ''}
                        ${parsed.buildings ? `<div><strong>Building:</strong> ${parsed.buildings} Story</div>` : ''}
                        ${parsed.pressure ? `<div><strong>Pressure:</strong> ${parsed.pressure}</div>` : ''}
                        ${parsed.quantity ? `<div><strong>Quantity:</strong> ${parsed.quantity} units</div>` : ''}
                    </div>
                </div>

                <p style="color: var(--text-muted); font-size: 12px; margin-top: var(--spacing-lg);">
                    <i class="fas fa-calendar"></i> ${formatDateTime(inquiry.createdAt)}
                </p>
            </div>
        `;

        modalContent.innerHTML = html;
        document.getElementById('inquiryModal').classList.add('active');
    }

    quickQuotation(id) {
        const inquiry = Storage.getInquiry(id);
        if (!inquiry) return;

        this.currentInquiry = inquiry;
        this.createQuotationFromInquiry();
    }

    createQuotationFromInquiry() {
        if (!this.currentInquiry) return;

        // Hide modal
        document.getElementById('inquiryModal').classList.remove('active');

        // Redirect to quotations page with inquiry data
        window.location.href = 'quotations.html?fromInquiry=' + this.currentInquiry.id;
    }

    deleteInquiry(id) {
        const inquiry = Storage.getInquiry(id);
        if (!inquiry) return;

        if (confirm(`Are you sure you want to delete this inquiry from ${inquiry.customerName}?`)) {
            Storage.updateInquiry(id, { status: 'deleted' });
            appManager.showToast('Inquiry deleted successfully!', 'success');
            this.loadInquiries();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.inquiriesManager = new InquiriesManager();
});
